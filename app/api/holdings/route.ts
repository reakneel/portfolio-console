import { NextRequest, NextResponse } from 'next/server';
import { upsertHolding, deleteHolding } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.code || !b.name || !(b.qty > 0) || !(b.costPrice > 0) || !(b.price > 0)) {
      return NextResponse.json({ error: '参数缺失或非法' }, { status: 400 });
    }
    await upsertHolding({
      code: String(b.code), name: String(b.name), qty: Number(b.qty),
      costPrice: Number(b.costPrice), price: Number(b.price),
      days: Number(b.days ?? 0), sector: String(b.sector ?? ''), dailyPnl: Number(b.dailyPnl ?? 0),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: '写入失败' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code');
  if (!code) return NextResponse.json({ error: '缺少 code' }, { status: 400 });
  await deleteHolding(code);
  return NextResponse.json({ ok: true });
}
