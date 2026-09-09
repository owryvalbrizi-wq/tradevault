# TradeVault

Realistic crypto trading dashboard powered by **live Binance market data** + WebSocket streams.

## Features

### Frontend
- Glassmorphism dark UI matching the original design
- Live ticker (BTC, ETH, SOL) updating in real-time via WebSocket
- Real-time order book (depth) from Binance
- Live trade tape
- 1h candlestick chart (from Binance klines)
- Interactive amount / % slider + Buy/Sell (demo orders)

### Backend (Next.js API Routes)
| Endpoint | Source |
|----------|--------|
| `GET /api/ticker` | Binance 24h ticker |
| `GET /api/orderbook` | Binance depth |
| `GET /api/trades` | Binance recent trades |
| `GET /api/chart` | Binance 1h klines |
| `POST /api/place-order` | Demo only (uses current Binance price) |

### Real-time
Client connects directly to Binance WebSocket:
- `btcusdt@ticker`, `ethusdt@ticker`, `solusdt@ticker`
- `btcusdt@trade`
- `btcusdt@depth10@100ms`

No API keys required for market data.

## Run locally

```bash
cd tradevault
npm install
npm run dev
```

Open http://localhost:3000

## Notes
- Place-order is **demo only** – no real trading occurs.
- Data is public market data from Binance (USDT pairs shown as /USD).
