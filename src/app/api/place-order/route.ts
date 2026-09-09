import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { side, amount, total } = body;

    if (!side || !["buy", "sell"].includes(side)) {
      return NextResponse.json(
        { success: false, error: "Invalid side. Use 'buy' or 'sell'." },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0." },
        { status: 400 }
      );
    }

    await new Promise((r) => setTimeout(r, 350 + Math.random() * 450));

    let fillPrice = 0;
    try {
      const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
      if (res.ok) {
        const d = await res.json();
        fillPrice = parseFloat(d.price) + (Math.random() - 0.5) * 8;
      }
    } catch {
      fillPrice = 95000 + (Math.random() - 0.5) * 200;
    }

    const orderId = `DEMO-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        side,
        amount: +Number(amount).toFixed(6),
        total: total || +(Number(amount) * fillPrice).toFixed(2),
        fillPrice: +fillPrice.toFixed(1),
        status: "filled",
        timestamp: Date.now(),
        note: "This is a simulated demo order. No real funds were used.",
      },
      message: `${side.toUpperCase()} order filled (demo)`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
