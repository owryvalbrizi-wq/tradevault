import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=20",
      { next: { revalidate: 3 } }
    );
    if (!res.ok) throw new Error("Binance trades failed");
    const data = await res.json();

    const trades = data.map((t: any) => {
      const time = new Date(t.time);
      return {
        id: String(t.id),
        side: t.isBuyerMaker ? "sell" : "buy",
        size: +parseFloat(t.qty).toFixed(4),
        price: +parseFloat(t.price).toFixed(1),
        time: time.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        timestamp: t.time,
      };
    }).reverse();

    return NextResponse.json({
      success: true,
      data: trades,
      source: "binance",
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Trades error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trades" },
      { status: 502 }
    );
  }
}
