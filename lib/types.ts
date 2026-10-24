// 领域类型定义 —— 实盘助手核心数据模型
export interface Holding {
  code: string;        // 证券代码
  name: string;        // 简称
  qty: number;         // 持有数量
  costPrice: number;   // 成本价
  price: number;       // 最新价
  days: number;        // 持有天数
  sector: string;      // 行业
  dailyPnl: number;    // 当日盈亏（元，含派息口径见 README）
}

export interface ClosedPosition {
  name: string;
  realizedPnl: number; // 已实现累计盈亏（元）
}

export interface AccountSnapshot {
  asOf: string;            // 数据时点
  totalAssets: number;     // 总资产
  marketValue: number;     // 持仓市值
  cash: number;            // 现金
  dailyGain: number;       // 今日收益（总资产口径，元）
  dailyGainPct: number;    // 今日收益率（较昨日，%）
  dailyPnlHoldings: number;// 今日总盈亏（持仓口径，元）
  dailyPnlHoldingsPct: number;
  dailyDividend: number;   // 今日含派息（元）
  cumDividend: number;     // 累计派息（元）
  dividendYieldMV: number; // 持股派息率（近12月/持仓市值，%）
  dividendYieldCost: number;// 成本派息率（近12月/持仓成本，%）
  maxDrawdown: number;     // 最大回撤（成立以来，%）
  winRate30: number;       // 近30日胜率（%）
  winDays30: number;
  loseDays30: number;
  maxSingleWeight: number; // 最大单股权重（占总资产，%）
  positionsCount: number;
  todayReturn: number;     // 组合当日收益率（%），基准卡当日跑赢口径
}

export interface Benchmark {
  key: string;
  name: string;            // 沪深300 / 上证指数 / 创业板指
  today: number;           // 基准当日（%）
  cumOut: number;          // 累计跑赢（百分点）
  dayOut: number;          // 当日跑赢（百分点）
}

export interface NavPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma20: number;
}

export interface ReturnPoint {
  date: string;
  portfolio: number;
  hs300: number;
  sse: number;
  csi: number;
}

export interface ExcessPoint {
  date: string;
  value: number; // 组合 - 沪深300 累计超额（%）
}

export interface TradeRecord {
  date: string;
  code: string;
  name: string;
  side: 'buy' | 'sell';
  price: number;
  qty: number;
  amount: number;
  fee: number;
  note: string;
}

export interface EventItem {
  date: string;
  type: 'dividend' | 'move' | 'rebalance' | 'risk';
  title: string;
  detail: string;
}

export interface EarningsItem {
  code: string;
  name: string;
  date: string;
  period: string;
  status: 'upcoming' | 'reported';
  expect: string;
}

export interface DashboardData {
  snapshot: AccountSnapshot;
  holdings: Holding[];
  closed: ClosedPosition[];
  benchmarks: Benchmark[];
  navSeries: NavPoint[];
  returnSeries: ReturnPoint[];
  excessSeries: ExcessPoint[];
  trades: TradeRecord[];
  events: EventItem[];
  earnings: EarningsItem[];
  dataSource: 'demo' | 'postgres';
}
