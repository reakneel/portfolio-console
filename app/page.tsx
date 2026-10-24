'use client';
// 投资组合监控中控台 —— 主页面
import { useEffect, useMemo, useState } from 'react';
import type { DashboardData, Holding } from '@/lib/types';
import { enrichHoldings, fmtMoney, fmtPct, fmtSigned, fmtWan } from '@/lib/calc';
import { NavKline, DivergingBars, CumReturnChart, SeriesLegend, ExcessChart } from '@/components/charts';

const TABS = [
  { key: 'overview', label: '持仓概览', icon: '📊' },
  { key: 'trend', label: '走势分析', icon: '📈' },
  { key: 'events', label: '重大事件', icon: '🔔' },
  { key: 'earnings', label: '财报追踪', icon: '📅' },
  { key: 'trades', label: '交易记录', icon: '🧾' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<TabKey>('overview');

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: DashboardData) => setData(d))
      .catch(() => setError(true));
  }, []);

  const rows = useMemo(
    () => (data ? enrichHoldings(data.holdings, data.snapshot.totalAssets) : []),
    [data]
  );

  const cumItems = useMemo(() => {
    if (!data) return [];
    const held = rows.map((h) => ({ name: h.name, value: h.pnl }));
    const closed = data.closed.map((c) => ({ name: c.name, value: c.realizedPnl }));
    return [...held, ...closed].sort((a, b) => a.value - b.value);
  }, [rows, data]);

  if (error) {
    return <div className="state-box">数据加载失败，请刷新重试。</div>;
  }
  if (!data) {
    return <div className="state-box">正在加载组合数据…</div>;
  }

  const s = data.snapshot;
  const dailyItems = [...data.holdings]
    .sort((a, b) => a.dailyPnl - b.dailyPnl)
    .map((h) => ({ name: h.name, value: h.dailyPnl }));

  return (
    <div className="page">
      {/* ============ 顶部 ============ */}
      <header className="topbar">
        <div>
          <div className="brand-title">
            <span className="brand-icon">◈</span>
            投资组合监控中控台
          </div>
          <div className="brand-sub">
            数据时点：{s.asOf} · 自动更新 16:30 · 演示数据（快照 2026-10-23） · 持仓 {s.positionsCount} 只
            {data.dataSource === 'postgres' ? ' · 已连接数据库' : ' · 未配置数据库，使用内置演示数据'}
          </div>
        </div>
        <div className="live-badge"><span className="live-dot" />系统运行中</div>
      </header>

      {/* ============ KPI 四卡 ============ */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">💰 总资产</div>
          <div className="kpi-value num">{fmtMoney(s.totalAssets)}<span className="unit">元</span></div>
          <div className="kpi-sub">
            持仓 <span className="hl num">{fmtMoney(s.marketValue, 0)}</span> · 现金{' '}
            <span className="hl num">{fmtMoney(s.cash)}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">📊 累计盈亏</div>
          <div className={`kpi-value num ${s.dailyGain >= 0 ? 'up' : 'down'}`}>
            {fmtSigned(s.dailyGain)}<span className="unit">元</span>
          </div>
          <div className="kpi-sub">
            <span className={`hl ${s.dailyGainPct >= 0 ? 'up' : 'down'}`}>{fmtPct(s.dailyGainPct)}</span> · 口径：今日总资产变动
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">📦 持仓市值</div>
          <div className="kpi-value num">{fmtMoney(s.marketValue, 0)}<span className="unit">元</span></div>
          <div className="kpi-sub">共 <span className="hl num">{s.positionsCount}</span> 只持仓 · 仓位{' '}
            <span className="hl num">{((s.marketValue / s.totalAssets) * 100).toFixed(1)}%</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">⚡ 今日总盈亏</div>
          <div className={`kpi-value num ${s.dailyPnlHoldings >= 0 ? 'up' : 'down'}`}>
            {fmtSigned(s.dailyPnlHoldings, 0)}<span className="unit">元</span>
          </div>
          <div className="kpi-sub">
            <span className={`hl ${s.dailyPnlHoldingsPct >= 0 ? 'up' : 'down'}`}>{fmtPct(s.dailyPnlHoldingsPct)}</span>
            {' '}· 含派息 <span className="hl up num">+{fmtMoney(s.dailyDividend, 0)}</span> 元
          </div>
        </div>
      </section>

      {/* ============ 组合诊断 + 派息收益 ============ */}
      <section className="diag-grid">
        <div className="panel">
          <div className="panel-head">🧭 组合诊断</div>
          <div className="diag-row">
            <div className="diag-item">
              <div className="k">满仓度</div>
              <div className="v num">{((s.marketValue / s.totalAssets) * 100).toFixed(1)}%</div>
            </div>
            <div className="diag-item">
              <div className="k">最大回撤（区间）</div>
              <div className={`v num ${s.maxDrawdown < 0 ? 'down' : 'up'}`}>{s.maxDrawdown.toFixed(1)}%</div>
            </div>
            <div className="diag-item">
              <div className="k">近30日胜率</div>
              <div className="v num">{s.winRate30}%<small>{s.winDays30}涨 / {s.loseDays30}跌</small></div>
            </div>
            <div className="diag-item">
              <div className="k">最大单股</div>
              <div className="v num">{s.maxSingleWeight}%<small>中国石油</small></div>
            </div>
          </div>
          <div className="diag-foot">
            当前组合以红利底仓（石油 / 电力 / 银行）+ 周期资源（有色 / 航运）为主，科技成长仓位拖累明显（宁德时代 / 思源电气 / 完美世界浮亏均超 37%）。
          </div>
        </div>
        <div className="panel green">
          <div className="panel-head">🌱 股息收益</div>
          <div className="diag-row">
            <div className="diag-item">
              <div className="k">累计派息</div>
              <div className="v num">¥{fmtMoney(s.cumDividend, 0)}</div>
            </div>
            <div className="diag-item">
              <div className="k">持股派息率</div>
              <div className="v num" style={{ color: 'var(--green)' }}>{s.dividendYieldMV.toFixed(2)}%</div>
            </div>
            <div className="diag-item">
              <div className="k">成本派息率</div>
              <div className="v num" style={{ color: 'var(--green)' }}>{s.dividendYieldCost.toFixed(2)}%</div>
            </div>
          </div>
          <div className="diag-foot">
            今日到账派息 +{fmtMoney(s.dailyDividend, 0)} 元（中国石油 2026 年度分红），股息贡献已计入今日盈亏。
          </div>
        </div>
      </section>

      {/* ============ 标签页 ============ */}
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {/* ============ 持仓概览 ============ */}
      {tab === 'overview' && (
        <>
          <div className="chart-card">
            <div className="chart-title">📉 组合净值 K 线图</div>
            <div className="chart-sub">
              日频组合总资产（元）· 紫色线为 20 日均线 · 区间 {data.navSeries[0]?.date} ~ {data.navSeries[data.navSeries.length - 1]?.date}
            </div>
            <NavKline data={data.navSeries} />
          </div>

          <div className="chart-row">
            <div className="chart-card">
              <div className="chart-title">当日盈亏（瀑布图）</div>
              <div className="chart-sub">按个股当日贡献排序 · 合计 {fmtSigned(s.dailyPnlHoldings, 0)} 元</div>
              <DivergingBars items={dailyItems} />
            </div>
            <div className="chart-card">
              <div className="chart-title">累计盈亏</div>
              <div className="chart-sub">持仓浮动盈亏 + 已清仓标的实现盈亏（元）</div>
              <DivergingBars
                items={cumItems}
                valueFmt={(v) => (v >= 0 ? '+' : '-') + fmtWan(Math.abs(v))}
              />
            </div>
          </div>

          <section className="bench-grid">
            {data.benchmarks.map((b) => (
              <div key={b.key} className="bench-card">
                <div className="bench-name">vs {b.name}</div>
                <div className="bench-today">{b.name}当日 {fmtPct(b.today)}</div>
                <div className={`bench-main num ${b.cumOut >= 0 ? 'up' : 'down'}`}>
                  {fmtPct(b.cumOut)}
                </div>
                <div className="bench-today">累计跑赢</div>
                <div className={`bench-day num ${b.dayOut >= 0 ? 'up' : 'down'}`}>
                  当日跑赢 {fmtPct(b.dayOut)}
                </div>
              </div>
            ))}
          </section>

          <div className="chart-card">
            <div className="chart-title">累计收益率走势对比（vs 沪深300 / 上证指数 / 创业板指）</div>
            <div className="chart-sub">以 2025-12-31 为基准 0%，含分红再投资口径</div>
            <SeriesLegend />
            <CumReturnChart data={data.returnSeries} />
          </div>

          <div className="chart-card">
            <div className="chart-title">超额收益曲线（组合 − 沪深300）</div>
            <div className="chart-sub">正超额为红色，负超额为蓝色 · 区间累计超额 {fmtPct(data.benchmarks[0].cumOut)}</div>
            <ExcessChart data={data.excessSeries} />
          </div>

          <div className="chart-card">
            <div className="chart-title">持仓明细</div>
            <div className="chart-sub">按市值降序 · 仓位口径为占总资产比例</div>
            <HoldingsTable rows={rows} />
          </div>
        </>
      )}

      {/* ============ 走势分析 ============ */}
      {tab === 'trend' && (
        <>
          <section className="stat-grid">
            <div className="stat-cell">
              <div className="k">区间收益（组合）</div>
              <div className={`v num ${data.returnSeries.at(-1)!.portfolio >= 0 ? 'up' : 'down'}`}>
                {fmtPct(data.returnSeries.at(-1)!.portfolio)}
              </div>
            </div>
            <div className="stat-cell">
              <div className="k">区间最大回撤</div>
              <div className="v num down">{s.maxDrawdown.toFixed(2)}%</div>
            </div>
            <div className="stat-cell">
              <div className="k">累计超额（vs 沪深300）</div>
              <div className="v num up">{fmtPct(data.benchmarks[0].cumOut)}</div>
            </div>
            <div className="stat-cell">
              <div className="k">近30日胜率</div>
              <div className="v num">{s.winRate30}%</div>
            </div>
          </section>

          <div className="chart-card">
            <div className="chart-title">累计收益率走势对比</div>
            <SeriesLegend />
            <CumReturnChart data={data.returnSeries} />
          </div>
          <div className="chart-card">
            <div className="chart-title">超额收益曲线（组合 − 沪深300）</div>
            <ExcessChart data={data.excessSeries} />
          </div>
          <div className="chart-card">
            <div className="chart-title">组合净值 K 线图</div>
            <NavKline data={data.navSeries} />
          </div>
        </>
      )}

      {/* ============ 重大事件 ============ */}
      {tab === 'events' && (
        <div className="chart-card">
          <div className="chart-title">重大事件</div>
          <div className="chart-sub">派息、异动、调仓、风险提醒</div>
          {data.events.map((e, i) => (
            <div className="list-item" key={i}>
              <div className="list-date num">{e.date}</div>
              <div className="list-body">
                <div className="list-title">
                  <span className={`tag ${e.type}`}>{{
                    dividend: '派息', move: '异动', rebalance: '调仓', risk: '风险',
                  }[e.type]}</span>
                  {e.title}
                </div>
                <div className="list-detail">{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ 财报追踪 ============ */}
      {tab === 'earnings' && (
        <div className="chart-card">
          <div className="chart-title">财报追踪</div>
          <div className="chart-sub">持仓股业绩披露日历 · 预期信息仅供参考，非一手来源需核实原文</div>
          {data.earnings.map((e, i) => (
            <div className="list-item" key={i}>
              <div className="list-date num">{e.date}</div>
              <div className="list-body">
                <div className="list-title">
                  <span className={`tag ${e.status}`}>{e.status === 'upcoming' ? '待披露' : '已披露'}</span>
                  {e.name} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{e.code} · {e.period}</span>
                </div>
                <div className="list-detail">{e.expect}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ 交易记录 ============ */}
      {tab === 'trades' && (
        <div className="chart-card">
          <div className="chart-title">交易记录</div>
          <div className="chart-sub">逐笔成交与调仓备注</div>
          <div className="table-wrap">
            <table className="holdings">
              <thead>
                <tr>
                  <th>日期</th><th>代码</th><th>名称</th><th>方向</th>
                  <th>价格</th><th>数量</th><th>金额</th><th>费用</th><th>备注</th>
                </tr>
              </thead>
              <tbody>
                {data.trades.map((t, i) => (
                  <tr key={i}>
                    <td className="num" style={{ textAlign: 'left' }}>{t.date}</td>
                    <td><span className="code-link">{t.code}</span></td>
                    <td><span className="stock-name">{t.name}</span></td>
                    <td><span className={`tag ${t.side}`}>{t.side === 'buy' ? '买入' : '卖出'}</span></td>
                    <td className="num">{t.price.toFixed(3)}</td>
                    <td className="num">{t.qty.toLocaleString('zh-CN')}</td>
                    <td className="num">{fmtMoney(t.amount)}</td>
                    <td className="num">{fmtMoney(t.fee)}</td>
                    <td style={{ textAlign: 'left', color: 'var(--muted)' }}>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ 免责声明 ============ */}
      <div className="disclaimer">
        数据来源说明：本页展示数据为演示快照（截取自公开展示截图，时点 2026-10-23），净值 / 收益率 / 超额序列为确定性模拟生成，仅用于功能演示与界面还原；接入 POSTGRES_URL 后可写入真实持仓。
        {' '}
        <strong>免责声明</strong>：以上内容基于公开数据和量化分析，仅供参考，不构成投资建议。市场有风险，投资需谨慎。任何投资决策应结合个人风险承受能力、资金状况和投资目标独立判断，必要时咨询持牌专业机构。过往表现不预示未来收益。
      </div>
    </div>
  );
}

/* ============ 持仓明细表 ============ */
function HoldingsTable({ rows }: { rows: Array<Holding & {
  marketValue: number; pnl: number; pnlPct: number; weightPct: number;
}> }) {
  return (
    <div className="table-wrap">
      <table className="holdings">
        <thead>
          <tr>
            <th>代码</th><th>名称</th><th>数量</th><th>成本价</th><th>最新价</th>
            <th>市值</th><th>盈亏额</th><th>盈亏率</th><th>仓位</th><th>天数</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.code}>
              <td><span className="code-link">{r.code}</span></td>
              <td>
                <span className="stock-name">{r.name}</span>
                <span className="badge-sector">{r.sector}</span>
              </td>
              <td className="num">{r.qty.toLocaleString('zh-CN')}</td>
              <td className="num">{r.costPrice.toFixed(3)}</td>
              <td className="num">{r.price.toFixed(3)}</td>
              <td className="num">{fmtMoney(r.marketValue, 0)}</td>
              <td className={`num ${r.pnl >= 0 ? 'up' : 'down'}`}>{fmtSigned(r.pnl, 0)}</td>
              <td className={`num ${r.pnlPct >= 0 ? 'up' : 'down'}`}>{fmtPct(r.pnlPct)}</td>
              <td className="num">{r.weightPct.toFixed(1)}%</td>
              <td className="num">{r.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
