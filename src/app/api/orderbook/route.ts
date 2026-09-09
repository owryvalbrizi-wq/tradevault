import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10",
      { next: { revalidate: 2 } }
    );
    if (!res.ok) throw new Error("Binance depth failed");
    const d = await res.json();

    const formatSide = (levels: [string, string][]) => {
      let total = 0;
      return levels.map(([price, qty]) => {
        const p = parseFloat(price);
        const s = parseFloat(qty);
        total += s * p;
        return {
          price: +p.toFixed(1),
          size: +s.toFixed(4),
          total: +(total / 1000).toFixed(1),
        };
      });
    };

    return NextResponse.json({
      success: true,
      data: {
        bids: formatSide(d.bids),
        asks: formatSide(d.asks),
        mid: (parseFloat(d.bids[0][0]) + parseFloat(d.asks[0][0])) / 2,
      },
      source: "binance",
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Orderbook error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order book" },
      { status: 502 }
    );
  }
}
