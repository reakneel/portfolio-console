// 种子数据 —— 来源：用户提供截图快照（2026-10-23，雪球@发发发发发发发发发a，演示数据）
// 口径说明见 README「数据口径」章节。所有衍生序列由确定性 PRNG 生成，可复现。
import type {
  AccountSnapshot, Benchmark, ClosedPosition, EarningsItem, EventItem,
  Holding, TradeRecord, NavPoint, ReturnPoint, ExcessPoint,
} from './types';

export const AS_OF = '2026-10-23 15:00';
export const SERIES_START = '2025-12-31';
export const SERIES_END = '2026-10-23';

/* ---------------- 13 只持仓（截图持仓明细表，市值合计 429,880 元） ---------------- */
export const HOLDINGS: Holding[] = [
  { code: '601857', name: '中国石油',   qty: 5000,  costPrice: 11.074,  price: 12.750, days: 155, sector: '石油石化', dailyPnl: 259 },
  { code: '600900', name: '长江电力',   qty: 2000,  costPrice: 25.956,  price: 29.450, days: 155, sector: '公用事业', dailyPnl: -740 },
  { code: '601899', name: '紫金矿业',   qty: 2000,  costPrice: 32.453,  price: 28.790, days: 50,  sector: '有色金属', dailyPnl: 1900 },
  { code: '601919', name: '中远海控',   qty: 3500,  costPrice: 14.002,  price: 15.850, days: 155, sector: '交通运输', dailyPnl: 105 },
  { code: '601888', name: '中国中免',   qty: 900,   costPrice: 56.657,  price: 50.010, days: 140, sector: '商贸零售', dailyPnl: 981 },
  { code: '600036', name: '招商银行',   qty: 700,   costPrice: 41.479,  price: 41.770, days: 50,  sector: '银行',     dailyPnl: -60 },
  { code: '518880', name: '黄金ETF华安', qty: 3000, costPrice: 9.189,   price: 8.199,  days: 49,  sector: '商品ETF',  dailyPnl: -455 },
  { code: '513120', name: '港股创新药ETF广发', qty: 20000, costPrice: 1.187, price: 1.206, days: 155, sector: '医药ETF', dailyPnl: 560 },
  { code: '300750', name: '宁德时代',   qty: 100,   costPrice: 408.480, price: 237.600, days: 155, sector: '电力设备', dailyPnl: 1718 },
  { code: '000333', name: '美的集团',   qty: 200,   costPrice: 75.795,  price: 85.590, days: 155, sector: '家用电器', dailyPnl: 40 },
  { code: '002028', name: '思源电气',   qty: 100,   costPrice: 197.672, price: 109.420, days: 154, sector: '电力设备', dailyPnl: 152 },
  { code: '002624', name: '完美世界',   qty: 1000,  costPrice: 16.790,  price: 10.000, days: 155, sector: '传媒',     dailyPnl: 530 },
  { code: '513770', name: '港股互联网ETF华宝', qty: 30000, costPrice: 0.503, price: 0.313, days: 155, sector: '互联网ETF', dailyPnl: 219 },
];

/* ---------------- 已清仓标的（累计盈亏图中的历史持仓） ---------------- */
export const CLOSED: ClosedPosition[] = [
  { name: '贵州茅台',   realizedPnl: 16000 },
  { name: '长城科技',   realizedPnl: 18000 },
  { name: '红利低波100', realizedPnl: 1000 },
];

/* ---------------- 账户快照 KPI ---------------- */
export const SNAPSHOT: AccountSnapshot = {
  asOf: AS_OF,
  totalAssets: 498356.27,
  marketValue: 429880,
  cash: 68476.27,
  dailyGain: 5278.16,
  dailyGainPct: 1.07,
  dailyPnlHoldings: 5209,
  dailyPnlHoldingsPct: 1.21,
  dailyDividend: 1505,
  cumDividend: 11159,
  dividendYieldMV: 1.94,
  dividendYieldCost: 1.82,
  maxDrawdown: -29.5,
  winRate30: 40,
  winDays30: 12,
  loseDays30: 18,
  maxSingleWeight: 12.8,
  positionsCount: 13,
  todayReturn: 1.05,
};

/* ---------------- 基准对比（当日跑赢 = 组合当日 +1.05% − 基准当日） ---------------- */
export const BENCHMARKS: Benchmark[] = [
  { key: 'hs300', name: '沪深300',   today: 1.71, cumOut: 10.02, dayOut: -0.66 },
  { key: 'sse',   name: '上证指数',  today: 0.89, cumOut: 5.70,  dayOut: 0.16 },
  { key: 'csi',   name: '创业板指',  today: 4.15, cumOut: 14.90, dayOut: -3.10 },
];

/* ---------------- 交易记录（逐笔，节选自建仓轨迹） ---------------- */
export const TRADES: TradeRecord[] = [
  { date: '2026-08-11', code: '601899', name: '紫金矿业',   side: 'buy',  price: 32.453, qty: 2000,  amount: 64906, fee: 32.5, note: '回调加仓' },
  { date: '2026-08-12', code: '600036', name: '招商银行',   side: 'buy',  price: 41.479, qty: 700,   amount: 29035.3, fee: 14.5, note: '底仓建仓' },
  { date: '2026-08-13', code: '518880', name: '黄金ETF华安', side: 'buy', price: 9.189,  qty: 3000,  amount: 27567, fee: 13.8, note: '黄金对冲配置' },
  { date: '2026-05-22', code: '601888', name: '中国中免',   side: 'buy',  price: 56.657, qty: 900,   amount: 50991.3, fee: 25.5, note: '消费复苏布局' },
  { date: '2026-05-12', code: '002028', name: '思源电气',   side: 'buy',  price: 197.672, qty: 100,  amount: 19767.2, fee: 9.9,  note: '电网设备追高' },
  { date: '2026-04-28', code: '002624', name: '完美世界',   side: 'buy',  price: 16.790, qty: 1000,  amount: 16790, fee: 8.4, note: 'AI 应用主题' },
  { date: '2026-04-25', code: '513770', name: '港股互联网ETF华宝', side: 'buy', price: 0.503, qty: 30000, amount: 15090, fee: 7.5, note: '港股互联网抄底' },
  { date: '2026-04-24', code: '000333', name: '美的集团',   side: 'buy',  price: 75.795, qty: 200,   amount: 15159, fee: 7.6, note: '高股息白电' },
  { date: '2026-04-23', code: '300750', name: '宁德时代',   side: 'buy',  price: 408.480, qty: 100,  amount: 40848, fee: 20.4, note: '新能源龙头建仓' },
  { date: '2026-04-21', code: '513120', name: '港股创新药ETF广发', side: 'buy', price: 1.187, qty: 20000, amount: 23740, fee: 11.9, note: '创新药左侧布局' },
  { date: '2026-04-21', code: '601919', name: '中远海控',   side: 'buy',  price: 14.002, qty: 3500,  amount: 49007, fee: 24.5, note: '航运周期底部' },
  { date: '2026-04-21', code: '600900', name: '长江电力',   side: 'buy',  price: 25.956, qty: 2000,  amount: 51912, fee: 26.0, note: '防御底仓' },
  { date: '2026-04-21', code: '601857', name: '中国石油',   side: 'buy',  price: 11.074, qty: 5000,  amount: 55370, fee: 27.7, note: '红利底仓' },
  { date: '2026-03-18', code: '600519', name: '贵州茅台',   side: 'sell', price: 1512.0, qty: 12,    amount: 18144, fee: 91.0, note: '止盈离场 +16,000' },
  { date: '2026-03-05', code: '603897', name: '长城科技',   side: 'sell', price: 28.60,  qty: 1200,  amount: 34320, fee: 34.0, note: '止盈离场 +18,000' },
  { date: '2026-02-10', code: '512890', name: '红利低波100', side: 'sell', price: 1.180, qty: 8600,  amount: 10148, fee: 5.1, note: '调仓换股 +1,000' },
];

/* ---------------- 重大事件 / 财报追踪 ---------------- */
export const EVENTS: EventItem[] = [
  { date: '2026-10-23', type: 'dividend', title: '中国石油派息到账', detail: '每股派 0.301 元，合计 +1,505 元，计入今日收益' },
  { date: '2026-10-20', type: 'move',     title: '紫金矿业单日涨超 7%', detail: '当日贡献 +1,900 元，为组合当日最大盈利来源' },
  { date: '2026-10-09', type: 'risk',     title: '宁德时代浮亏扩大至 -41.83%', detail: '触发持仓体检提醒，建议复核买入逻辑是否仍然成立' },
  { date: '2026-09-30', type: 'rebalance', title: '季度调仓复盘', detail: '满仓度 86.3%，最大单股 12.8%，行业集中于红利 + 资源' },
  { date: '2026-08-13', type: 'rebalance', title: '新增黄金ETF华安对冲仓', detail: '3,000 份 @ 9.189，占总资产 4.9%' },
  { date: '2026-07-13', type: 'risk',     title: '组合净值触及区间低点 466,000', detail: '较 3 月高点回撤 -12.6%，随后反弹' },
];

export const EARNINGS: EarningsItem[] = [
  { code: '601857', name: '中国石油',   date: '2026-10-29', period: '2026Q3', status: 'upcoming', expect: '机构一致预期净利同比 +2.1%' },
  { code: '600900', name: '长江电力',   date: '2026-10-30', period: '2026Q3', status: 'upcoming', expect: '来水偏枯，关注发电量指引' },
  { code: '601899', name: '紫金矿业',   date: '2026-10-28', period: '2026Q3', status: 'upcoming', expect: '铜金价高位，业绩弹性大' },
  { code: '600036', name: '招商银行',   date: '2026-10-27', period: '2026Q3', status: 'upcoming', expect: '息差企稳，不良率关注零售条线' },
  { code: '300750', name: '宁德时代',   date: '2026-10-25', period: '2026Q3', status: 'upcoming', expect: '毛利率环比是关键变量' },
  { code: '000333', name: '美的集团',   date: '2026-10-31', period: '2026Q3', status: 'upcoming', expect: '外销订单持续性' },
  { code: '601919', name: '中远海控',   date: '2026-10-30', period: '2026Q3', status: 'upcoming', expect: '运价回落幅度' },
  { code: '600519', name: '贵州茅台',   date: '2026-08-12', period: '2026H1', status: 'reported', expect: '已披露：营收 +8.2%（非一手来源，需核实原文）' },
];

/* ---------------- 序列生成（确定性，可复现） ---------------- */
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tradingDays(start: string, end: string): string[] {
  const out: string[] = [];
  const d = new Date(start + 'T00:00:00Z');
  const e = new Date(end + 'T00:00:00Z');
  while (d <= e) {
    const wd = d.getUTCDay();
    if (wd !== 0 && wd !== 6) out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

export const DATES = tradingDays(SERIES_START, SERIES_END);

// 关键锚点（与截图 K 线走势一致）
const NAV_WAYPOINTS: Array<[string, number]> = [
  ['2025-12-31', 511850], ['2026-01-20', 516000], ['2026-02-06', 524000],
  ['2026-02-20', 531000], ['2026-03-10', 526000], ['2026-03-23', 533000],
  ['2026-04-15', 520000], ['2026-04-28', 512000], ['2026-05-20', 504000],
  ['2026-06-05', 492000], ['2026-06-25', 478000], ['2026-07-13', 466000],
  ['2026-07-31', 495000], ['2026-08-17', 533000], ['2026-09-01', 522000],
  ['2026-09-21', 508000], ['2026-10-10', 493000], ['2026-10-23', 498356.27],
];

function anchorSeries(waypoints: Array<[string, number]>, dates: string[]): number[] {
  const vals: number[] = [];
  for (let i = 0; i < dates.length; i++) {
    const d = dates[i];
    let k = 0;
    while (k < waypoints.length - 1 && waypoints[k + 1][0] < d) k++;
    const [d0, v0] = waypoints[Math.min(k, waypoints.length - 1)];
    const [d1, v1] = waypoints[Math.min(k + 1, waypoints.length - 1)];
    if (d <= d0) { vals.push(v0); continue; }
    if (d >= d1) { vals.push(v1); continue; }
    const t = (new Date(d).getTime() - new Date(d0).getTime()) / (new Date(d1).getTime() - new Date(d0).getTime());
    vals.push(v0 + (v1 - v0) * t);
  }
  return vals;
}

function buildNav(): NavPoint[] {
  const rnd = mulberry32(20261023);
  const base = anchorSeries(NAV_WAYPOINTS, DATES);
  const closes = base.map((v, i) => {
    if (i === 0) return v;
    const noise = (rnd() - 0.5) * v * 0.006;
    return v + noise;
  });
  // 严格钉住首尾
  closes[0] = 511850;
  closes[closes.length - 1] = 498356.27;

  const pts: NavPoint[] = [];
  for (let i = 0; i < DATES.length; i++) {
    const prev = i === 0 ? closes[0] * 0.998 : closes[i - 1];
    const open = prev + (rnd() - 0.5) * closes[i] * 0.003;
    const close = closes[i];
    const hi = Math.max(open, close) * (1 + rnd() * 0.004);
    const lo = Math.min(open, close) * (1 - rnd() * 0.004);
    const w = Math.min(20, i + 1);
    const ma20 = closes.slice(i - w + 1, i + 1).reduce((a, b) => a + b, 0) / w;
    pts.push({ date: DATES[i], open: +open.toFixed(2), high: +hi.toFixed(2), low: +lo.toFixed(2), close: +close.toFixed(2), ma20: +ma20.toFixed(2) });
  }
  return pts;
}

export const NAV_SERIES: NavPoint[] = buildNav();

// 累计收益率（%）：终点由基准卡约束 —— 组合 -2.64%，沪深300 -12.66%，上证 -8.34%，创业板 -17.54%
const RET_END = { portfolio: -2.64, hs300: -12.66, sse: -8.34, csi: -17.54 };

function buildReturns(): ReturnPoint[] {
  const rnd = mulberry32(889911);
  const n = DATES.length;
  // 形态锚点（份额 0..1 → 累计%）：与截图累计收益走势图一致
  const shapes: Record<string, Array<[number, number]>> = {
    portfolio: [[0, 0], [0.12, 4.2], [0.3, 3.0], [0.45, -2.0], [0.58, -6.2], [0.68, -4.0], [0.78, 2.2], [0.88, 0.4], [1, RET_END.portfolio]],
    hs300:     [[0, 0], [0.12, 2.2], [0.3, 0.4], [0.45, -4.8], [0.58, -9.0], [0.68, -6.8], [0.78, -3.2], [0.88, -8.0], [1, RET_END.hs300]],
    sse:       [[0, 0], [0.12, 3.0], [0.3, 1.2], [0.45, -3.2], [0.58, -7.0], [0.68, -4.4], [0.78, -1.0], [0.88, -5.2], [1, RET_END.sse]],
    csi:       [[0, 0], [0.12, 8.0], [0.3, 18.0], [0.45, 30.0], [0.58, 35.0], [0.68, 18.0], [0.78, 6.0], [0.88, -8.0], [1, RET_END.csi]],
  };
  const sample = (wp: Array<[number, number]>, t: number) => {
    let k = 0;
    while (k < wp.length - 2 && wp[k + 1][0] < t) k++;
    const [t0, v0] = wp[k], [t1, v1] = wp[k + 1];
    const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1)));
    return v0 + (v1 - v0) * u;
  };
  return DATES.map((date, i) => {
    const t = n === 1 ? 1 : i / (n - 1);
    const j = (amp: number) => (i === 0 || i === n - 1 ? 0 : (rnd() - 0.5) * amp);
    return {
      date,
      portfolio: +(sample(shapes.portfolio, t) + j(0.8)).toFixed(2),
      hs300: +(sample(shapes.hs300, t) + j(0.7)).toFixed(2),
      sse: +(sample(shapes.sse, t) + j(0.6)).toFixed(2),
      csi: +(sample(shapes.csi, t) + j(1.1)).toFixed(2),
    };
  });
}

export const RETURN_SERIES: ReturnPoint[] = buildReturns();

// 超额收益（组合 − 沪深300，%）：终点 +10.02
function buildExcess(): ExcessPoint[] {
  const rnd = mulberry32(556677);
  const n = DATES.length;
  const wp: Array<[number, number]> = [
    [0, 0], [0.1, 2.0], [0.22, 3.4], [0.35, 1.2], [0.48, -2.6], [0.58, -5.4],
    [0.66, -3.0], [0.75, 2.8], [0.85, 6.2], [0.93, 8.8], [1, 10.02],
  ];
  const sample = (t: number) => {
    let k = 0;
    while (k < wp.length - 2 && wp[k + 1][0] < t) k++;
    const [t0, v0] = wp[k], [t1, v1] = wp[k + 1];
    const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1)));
    return v0 + (v1 - v0) * u;
  };
  return DATES.map((date, i) => {
    const t = n === 1 ? 1 : i / (n - 1);
    const j = i === 0 || i === n - 1 ? 0 : (rnd() - 0.5) * 0.7;
    return { date, value: +(sample(t) + j).toFixed(2) };
  });
}

export const EXCESS_SERIES: ExcessPoint[] = buildExcess();
