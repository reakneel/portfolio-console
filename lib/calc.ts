// 指标计算 —— 统一口径：涨=红/正数，跌=绿/负数（A股习惯）
import type { Holding, NavPoint, ReturnPoint } from './types';

export interface HoldingRow extends Holding {
  marketValue: number;
  pnl: number;
  pnlPct: number;
  weightPct: number; // 占总资产
}

export function enrichHoldings(holdings: Holding[], totalAssets: number): HoldingRow[] {
  return holdings.map((h) => {
    const marketValue = h.qty * h.price;
    const cost = h.qty * h.costPrice;
    const pnl = marketValue - cost;
    return {
      ...h,
      marketValue: +marketValue.toFixed(2),
      pnl: +pnl.toFixed(2),
      pnlPct: +((pnl / cost) * 100).toFixed(2),
      weightPct: +((marketValue / totalAssets) * 100).toFixed(1),
    };
  });
}

export function maxDrawdownFromNav(series: NavPoint[]): number {
  let peak = -Infinity, mdd = 0;
  for (const p of series) {
    if (p.close > peak) peak = p.close;
    const dd = (p.close - peak) / peak;
    if (dd < mdd) mdd = dd;
  }
  return +(mdd * 100).toFixed(2);
}

export function winRateFromReturns(series: ReturnPoint[], window = 30): { win: number; lose: number; rate: number } {
  const rets: number[] = [];
  for (let i = 1; i < series.length; i++) rets.push(series[i].portfolio - series[i - 1].portfolio);
  const last = rets.slice(-window);
  const win = last.filter((r) => r > 0).length;
  const lose = last.filter((r) => r <= 0).length;
  return { win, lose, rate: +((win / (last.length || 1)) * 100).toFixed(0) };
}

export function fmtMoney(v: number, digits = 2): string {
  return v.toLocaleString('zh-CN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtSigned(v: number, digits = 2): string {
  return (v >= 0 ? '+' : '') + fmtMoney(v, digits);
}

export function fmtPct(v: number, digits = 2): string {
  return (v >= 0 ? '+' : '') + v.toFixed(digits) + '%';
}

export function fmtWan(v: number): string {
  const w = v / 10000;
  return (Math.abs(w) >= 1 ? w.toFixed(1) : w.toFixed(2)) + '万';
}
