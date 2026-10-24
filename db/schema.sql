-- Vercel Postgres / Neon 适配 schema
-- 在 Vercel 项目 Storage 中创建 Postgres 后，用此文件初始化表结构

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

-- 可选：逐笔成交记录（后续扩展）
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  trade_date DATE NOT NULL,
  code TEXT NOT NULL,
  name TEXT,
  side TEXT CHECK (side IN ('buy', 'sell')),
  price NUMERIC NOT NULL,
  qty NUMERIC NOT NULL,
  amount NUMERIC,
  fee NUMERIC DEFAULT 0,
  note TEXT
);

-- 可选：每日净值快照（用于真实 K 线 / 回撤计算）
CREATE TABLE IF NOT EXISTS nav_daily (
  d DATE PRIMARY KEY,
  open NUMERIC, high NUMERIC, low NUMERIC, close NUMERIC
);
