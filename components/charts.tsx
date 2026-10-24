'use client';
// SVG 图表组件集：K线图 / 双向条形图 / 多折线图 / 超额柱状图
import React from 'react';
import type { NavPoint, ReturnPoint, ExcessPoint } from '@/lib/types';

const UP = '#e53935';
const DOWN = '#2196f3';
const PURPLE = '#9e86d8';
const GRID = '#eef0f5';
const AXIS = '#9ba1ad';

function niceTicks(min: number, max: number, count = 5): number[] {
  const span = max - min || 1;
  const step = span / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

/* ============ 1. 组合净值 K 线图（含 MA20） ============ */
export function NavKline({ data }: { data: NavPoint[] }) {
  const W = 1080, H = 340, PL = 58, PR = 14, PT = 16, PB = 30;
  const iw = W - PL - PR, ih = H - PT - PB;
  if (!data.length) return null;
  const lo = Math.min(...data.map((d) => d.low));
  const hi = Math.max(...data.map((d) => d.high));
  const pad = (hi - lo) * 0.06;
  const yMin = lo - pad, yMax = hi + pad;
  const x = (i: number) => PL + (iw * i) / Math.max(1, data.length - 1);
  const y = (v: number) => PT + ih - ((v - yMin) / (yMax - yMin)) * ih;
  const cw = Math.max(1.6, (iw / data.length) * 0.56);

  const maPath = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.ma20).toFixed(1)}`).join('');
  const ticks = niceTicks(yMin, yMax, 6);
  // x 轴日期刻度（约 8 个）
  const dateIdx = Array.from(new Set([0, Math.floor(data.length * 0.14), Math.floor(data.length * 0.29),
    Math.floor(data.length * 0.43), Math.floor(data.length * 0.57), Math.floor(data.length * 0.71),
    Math.floor(data.length * 0.85), data.length - 1]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="组合净值K线图">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke={GRID} strokeDasharray="3 4" />
          <text x={PL - 8} y={y(t) + 4} fontSize="10" fill={AXIS} textAnchor="end">
            {(t / 10000).toFixed(1)}万
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const up = d.close >= d.open;
        const c = up ? UP : DOWN;
        const yo = y(d.open), yc = y(d.close), yh = y(d.high), yl = y(d.low);
        return (
          <g key={i}>
            <line x1={x(i)} x2={x(i)} y1={yh} y2={yl} stroke={c} strokeWidth={1} />
            <rect
              x={x(i) - cw / 2}
              y={Math.min(yo, yc)}
              width={cw}
              height={Math.max(1, Math.abs(yc - yo))}
              fill={up ? 'none' : c}
              stroke={c}
              strokeWidth={1}
            />
          </g>
        );
      })}
      <path d={maPath} fill="none" stroke={PURPLE} strokeWidth={1.6} />
      {dateIdx.map((i) => (
        <text key={i} x={x(i)} y={H - 10} fontSize="10" fill={AXIS} textAnchor="middle">
          {data[i]?.date.slice(2).replace(/-/g, '/')}
        </text>
      ))}
    </svg>
  );
}

/* ============ 2. 双向水平条形图（当日盈亏 / 累计盈亏） ============ */
export function DivergingBars({
  items, unit = '元', valueFmt,
}: {
  items: Array<{ name: string; value: number }>;
  unit?: string;
  valueFmt?: (v: number) => string;
}) {
  const rowH = 22, labelW = 92, rightW = 62;
  const W = 520, PT = 8, PB = 24;
  const H = PT + items.length * rowH + PB;
  const maxAbs = Math.max(...items.map((d) => Math.abs(d.value)), 1);
  const mid = labelW + (W - labelW - rightW) * 0.34; // 0 轴偏左（正数空间更大）
  const scale = (v: number) => (v / maxAbs) * (mid - labelW - 8) * (v < 0 ? 1 : (W - rightW - mid - 8) / (mid - labelW - 8));

  const fmt = valueFmt ?? ((v: number) => (v >= 0 ? '+' : '') + v.toLocaleString('zh-CN'));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img">
      {/* 0 轴 */}
      <line x1={mid} x2={mid} y1={PT} y2={H - PB + 4} stroke={GRID} strokeWidth={1} />
      {/* 刻度 */}
      {niceTicks(-maxAbs, maxAbs, 5).map((t, i) => {
        const px = mid + scale(t);
        return (
          <g key={i}>
            <line x1={px} x2={px} y1={PT} y2={H - PB + 4} stroke={GRID} strokeDasharray="2 4" />
            <text x={px} y={H - 10} fontSize="9" fill={AXIS} textAnchor="middle">
              {t >= 0 ? '+' : ''}{Math.abs(t) >= 10000 ? (t / 10000).toFixed(1) + '万' : Math.round(t)}
            </text>
          </g>
        );
      })}
      {items.map((d, i) => {
        const cy = PT + i * rowH + rowH / 2;
        const w = Math.abs(scale(d.value));
        const bx = d.value >= 0 ? mid : mid - w;
        return (
          <g key={d.name}>
            <text x={labelW - 6} y={cy + 4} fontSize="11" fill="#4a5164" textAnchor="end">
              {d.name.length > 7 ? d.name.slice(0, 7) : d.name}
            </text>
            <rect
              x={bx} y={cy - 6.5} width={Math.max(1.2, w)} height={13}
              rx={2.5} fill={d.value >= 0 ? UP : DOWN} opacity={0.92}
            />
            <text
              x={d.value >= 0 ? bx + w + 5 : bx - 5}
              y={cy + 4} fontSize="10"
              fill={d.value >= 0 ? UP : DOWN}
              textAnchor={d.value >= 0 ? 'start' : 'end'}
            >
              {fmt(d.value)}
            </text>
          </g>
        );
      })}
      <text x={W - rightW + 4} y={H - 10} fontSize="9" fill={AXIS} textAnchor="end">单位：{unit}</text>
    </svg>
  );
}

/* ============ 3. 累计收益率走势对比（4 线） ============ */
const SERIES_META = [
  { key: 'portfolio' as const, label: '组合净值', color: UP, width: 2.4 },
  { key: 'hs300' as const, label: '沪深300', color: '#f08a7e', width: 1.4 },
  { key: 'sse' as const, label: '上证指数', color: DOWN, width: 1.4 },
  { key: 'csi' as const, label: '创业板指', color: '#4caf6d', width: 1.4 },
];

export function CumReturnChart({ data }: { data: ReturnPoint[] }) {
  const W = 1080, H = 330, PL = 52, PR = 16, PT = 14, PB = 30;
  const iw = W - PL - PR, ih = H - PT - PB;
  if (!data.length) return null;
  const all = data.flatMap((d) => SERIES_META.map((s) => d[s.key]));
  const yMin = Math.min(...all) - 3, yMax = Math.max(...all) + 3;
  const x = (i: number) => PL + (iw * i) / Math.max(1, data.length - 1);
  const y = (v: number) => PT + ih - ((v - yMin) / (yMax - yMin)) * ih;
  const ticks = niceTicks(yMin, yMax, 6);
  const dateIdx = Array.from(new Set([0, Math.floor(data.length * 0.14), Math.floor(data.length * 0.29),
    Math.floor(data.length * 0.43), Math.floor(data.length * 0.57), Math.floor(data.length * 0.71),
    Math.floor(data.length * 0.85), data.length - 1]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="累计收益率走势对比">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke={GRID} strokeDasharray="3 4" />
          <text x={PL - 8} y={y(t) + 4} fontSize="10" fill={AXIS} textAnchor="end">{t.toFixed(1)}%</text>
        </g>
      ))}
      <line x1={PL} x2={W - PR} y1={y(0)} y2={y(0)} stroke="#d7dbe4" strokeWidth={1.2} />
      {SERIES_META.map((s) => (
        <path
          key={s.key}
          d={data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d[s.key]).toFixed(1)}`).join('')}
          fill="none" stroke={s.color} strokeWidth={s.width} strokeLinejoin="round"
        />
      ))}
      {dateIdx.map((i) => (
        <text key={i} x={x(i)} y={H - 10} fontSize="10" fill={AXIS} textAnchor="middle">
          {data[i]?.date.slice(2).replace(/-/g, '/')}
        </text>
      ))}
    </svg>
  );
}

export function SeriesLegend() {
  return (
    <div className="legend">
      {SERIES_META.map((s) => (
        <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>
      ))}
    </div>
  );
}

/* ============ 4. 超额收益曲线（柱状，组合 − 沪深300） ============ */
export function ExcessChart({ data }: { data: ExcessPoint[] }) {
  const W = 1080, H = 260, PL = 52, PR = 16, PT = 14, PB = 30;
  const iw = W - PL - PR, ih = H - PT - PB;
  if (!data.length) return null;
  const vals = data.map((d) => d.value);
  const yMin = Math.min(...vals, 0) - 2, yMax = Math.max(...vals, 0) + 2;
  const x = (i: number) => PL + (iw * (i + 0.5)) / data.length;
  const y = (v: number) => PT + ih - ((v - yMin) / (yMax - yMin)) * ih;
  const bw = Math.max(1.2, (iw / data.length) * 0.7);
  const ticks = niceTicks(yMin, yMax, 5);
  const dateIdx = Array.from(new Set([0, Math.floor(data.length * 0.14), Math.floor(data.length * 0.29),
    Math.floor(data.length * 0.43), Math.floor(data.length * 0.57), Math.floor(data.length * 0.71),
    Math.floor(data.length * 0.85), data.length - 1]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="超额收益曲线">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke={GRID} strokeDasharray="3 4" />
          <text x={PL - 8} y={y(t) + 4} fontSize="10" fill={AXIS} textAnchor="end">{t.toFixed(1)}%</text>
        </g>
      ))}
      {data.map((d, i) => {
        const y0 = y(0), y1 = y(d.value);
        return (
          <rect
            key={i} x={x(i) - bw / 2} y={Math.min(y0, y1)}
            width={bw} height={Math.max(1, Math.abs(y1 - y0))}
            fill={d.value >= 0 ? UP : DOWN} opacity={0.85}
          />
        );
      })}
      <line x1={PL} x2={W - PR} y1={y(0)} y2={y(0)} stroke="#d7dbe4" strokeWidth={1.2} />
      {dateIdx.map((i) => (
        <text key={i} x={x(i)} y={H - 10} fontSize="10" fill={AXIS} textAnchor="middle">
          {data[i]?.date.slice(2).replace(/-/g, '/')}
        </text>
      ))}
    </svg>
  );
}
