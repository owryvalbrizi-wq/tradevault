import { NextResponse } from "next/server";

const SYMBOLS = [
  { binance: "BTCUSDT", pair: "BTC/USD" },
  { binance: "ETHUSDT", pair: "ETH/USD" },
  { binance: "SOLUSDT", pair: "SOL/USD" },
];

export async function GET() {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async ({ binance, pair }) => {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${binance}`,
          { next: { revalidate: 5 } }
        );
        if (!res.ok) throw new Error(`Binance ${binance} failed`);
        const d = await res.json();
        const change = parseFloat(d.priceChangePercent);
        return {
          pair,
          price: parseFloat(d.lastPrice),
          change: +change.toFixed(2),
          changeAbs: Math.abs(change),
          direction: change >= 0 ? "positive" : "negative",
          high: parseFloat(d.highPrice),
          low: parseFloat(d.lowPrice),
          volume: parseFloat(d.volume),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
      source: "binance",
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Ticker error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ticker data" },
      { status: 502 }
    );
  }
}
