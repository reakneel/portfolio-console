// 数据访问层 —— 优先 Postgres（POSTGRES_URL / DATABASE_URL，适配 Vercel Postgres / Neon），
// 未配置时回落到演示种子数据（截图快照），保证零配置即可运行。
import postgres from 'postgres';
import type { DashboardData } from './types';
import {
  AS_OF, BENCHMARKS, CLOSED, EARNINGS, EVENTS, EXCESS_SERIES,
  HOLDINGS, NAV_SERIES, RETURN_SERIES, SNAPSHOT, TRADES,
} from './seed';
import { enrichHoldings, winRateFromReturns, maxDrawdownFromNav } from './calc';

function getSql() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) return null;
  return postgres(url, { ssl: 'require', connect_timeout: 5, max: 4 });
}

const ddl = `
CREATE TABLE IF NOT EXISTS holdings (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  qty NUMERIC NOT NULL,
  cost_price NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  days INTEGER NOT NULL DEFAULT 0,
  sector TEXT DEFAULT '',
  daily_pnl NUMERIC DEFAULT 0
);
CREATE TABLE IF NOT EXISTS account_snapshot (
  id INTEGER PRIMARY KEY DEFAULT 1,
  as_of TEXT,
  total_assets NUMERIC,
  cash NUMERIC,
  daily_gain NUMERIC,
  cum_dividend NUMERIC
);
`;

export async function getDashboardData(): Promise<DashboardData> {
  const sql = getSql();

  if (!sql) {
    return buildDemoData('demo');
  }

  try {
    await sql.unsafe(ddl);
    const rows = await sql`SELECT code, name, qty, cost_price, price, days, sector, daily_pnl FROM holdings ORDER BY code`;
    if (rows.length === 0) {
      // 首次访问：写入种子持仓，之后可自由增删改
      for (const h of HOLDINGS) {
        await sql`
          INSERT INTO holdings (code, name, qty, cost_price, price, days, sector, daily_pnl)
          VALUES (${h.code}, ${h.name}, ${h.qty}, ${h.costPrice}, ${h.price}, ${h.days}, ${h.sector}, ${h.dailyPnl})
          ON CONFLICT (code) DO NOTHING`;
      }
      return buildDemoData('postgres');
    }
    const holdings = rows.map((r) => ({
      code: String(r.code), name: String(r.name),
      qty: Number(r.qty), costPrice: Number(r.cost_price), price: Number(r.price),
      days: Number(r.days), sector: String(r.sector ?? ''), dailyPnl: Number(r.daily_pnl),
    }));
    const demo = buildDemoData('postgres');
    const marketValue = holdings.reduce((a, h) => a + h.qty * h.price, 0);
    return {
      ...demo,
      holdings,
      snapshot: {
        ...demo.snapshot,
        marketValue: +marketValue.toFixed(2),
        totalAssets: +(marketValue + demo.snapshot.cash).toFixed(2),
        positionsCount: holdings.length,
      },
    };
  } catch {
    return buildDemoData('demo'); // 数据库不可用时静默回落，页面始终可用
  } finally {
    if (sql) await sql.end({ timeout: 1 }).catch(() => {});
  }
}

function buildDemoData(source: 'demo' | 'postgres'): DashboardData {
  const wr = winRateFromReturns(RETURN_SERIES, 30);
  return {
    snapshot: {
      ...SNAPSHOT,
      winRate30: wr.rate,
      winDays30: wr.win,
      loseDays30: wr.lose,
      maxDrawdown: +Math.min(SNAPSHOT.maxDrawdown, maxDrawdownFromNav(NAV_SERIES)).toFixed(2),
    },
    holdings: HOLDINGS,
    closed: CLOSED,
    benchmarks: BENCHMARKS,
    navSeries: NAV_SERIES,
    returnSeries: RETURN_SERIES,
    excessSeries: EXCESS_SERIES,
    trades: TRADES,
    events: EVENTS,
    earnings: EARNINGS,
    dataSource: source,
  };
}

export async function upsertHolding(h: {
  code: string; name: string; qty: number; costPrice: number; price: number; days?: number; sector?: string; dailyPnl?: number;
}): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  try {
    await sql.unsafe(ddl);
    await sql`
      INSERT INTO holdings (code, name, qty, cost_price, price, days, sector, daily_pnl)
      VALUES (${h.code}, ${h.name}, ${h.qty}, ${h.costPrice}, ${h.price}, ${h.days ?? 0}, ${h.sector ?? ''}, ${h.dailyPnl ?? 0})
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name, qty = EXCLUDED.qty, cost_price = EXCLUDED.cost_price,
        price = EXCLUDED.price, days = EXCLUDED.days, sector = EXCLUDED.sector, daily_pnl = EXCLUDED.daily_pnl`;
  } finally {
    await sql.end({ timeout: 1 }).catch(() => {});
  }
}

export async function deleteHolding(code: string): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  try {
    await sql`DELETE FROM holdings WHERE code = ${code}`;
  } finally {
    await sql.end({ timeout: 1 }).catch(() => {});
  }
}

export const DATA_AS_OF = AS_OF;
