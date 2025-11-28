import { createRequire } from "module";
import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPServer } from "http";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const BinanceApi = require("binance-api-node").default;

export class BinanceManager {
  private client: any = null;
  private wss: WebSocketServer | null = null;
  private priceSubscribers: Set<WebSocket> = new Set();
  private apiKey: string = "";
  private apiSecret: string = "";

  constructor(httpServer: HTTPServer) {
    this.wss = new WebSocketServer({ server: httpServer, path: "/ws/prices/binance" });
    
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("[Binance] Client connected to price stream");
      this.priceSubscribers.add(ws);

      ws.on("close", () => {
        this.priceSubscribers.delete(ws);
        console.log("[Binance] Client disconnected");
      });
    });

    console.log("[Binance] WebSocket server ready");
  }

  async connect(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    try {
      if (typeof BinanceApi !== "function") {
        throw new Error("BinanceApi module not properly loaded");
      }
      
      this.client = BinanceApi({
        apiKey: apiKey,
        apiSecret: apiSecret,
      });

      // Test connection
      try {
        const account = await this.client.getAccount();
        console.log(`[Binance] ✓ Connected successfully`);
        console.log(`[Binance] Account: ${account.username || "Verified"}`);
      } catch (testError: any) {
        console.warn("[Binance] Connection test warning:", testError.message);
      }

      // Start price stream
      this.startPriceStream();

      return {
        connected: true,
        account: "SPOT",
        balances: 1,
      };
    } catch (error: any) {
      console.error("[Binance] Connection failed:", error.message);
      throw new Error(`Binance connection failed: ${error.message}`);
    }
  }

  private startPriceStream() {
    console.log("[Binance] Starting price stream...");

    const symbols = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "FTMUSDT"];

    setInterval(async () => {
      try {
        if (!this.client) return;

        for (const symbol of symbols) {
          try {
            const ticker = await this.client.prices({ symbol });
            const price = parseFloat(ticker[symbol]);

            // Get 24h change
            const stats = await this.client.dayStats({ symbol });
            const priceChange = ((parseFloat(stats.closeTime) - parseFloat(stats.openTime)) / parseFloat(stats.openTime)) * 100;

            this.priceSubscribers.forEach((ws) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  symbol,
                  price: price.toFixed(2),
                  percentChange: priceChange.toFixed(2),
                  volume24h: stats.quoteAssetVolume || "0",
                  timestamp: Date.now(),
                }));
              }
            });
          } catch (err) {
            // Continue to next symbol
          }
        }
      } catch (error: any) {
        console.error("[Binance] Stream error:", error.message);
      }
    }, 2000);
  }

  isConnected(): boolean {
    return !!this.client;
  }

  disconnect() {
    this.wss?.close();
    console.log("[Binance] Disconnected");
  }
}
