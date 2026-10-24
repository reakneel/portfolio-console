import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '投资组合监控中控台 · 个人实盘助手',
  description: '个人实盘投资组合监控：净值走势、持仓分析、基准对比、超额收益',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
