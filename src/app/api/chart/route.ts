import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=60",
      { next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error("Binance klines failed");
    const klines = await res.json();

    const prices = klines.map((k: any[]) => parseFloat(k[4]));
    const last = prices[prices.length - 1];
    const first = prices[0];
    const change = +(((last - first) / first) * 100).toFixed(2);

    return NextResponse.json({
      success: true,
      data: {
        prices,
        high: Math.max(...prices),
        low: Math.min(...prices),
        last,
        change,
      },
      source: "binance",
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Chart error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chart data" },
      { status: 502 }
    );
  }
}
