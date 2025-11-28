import Binance from "binance-api-node";
import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPServer } from "http";

export class BinanceManager {
  private client: any;
  private wss: WebSocketServer | null = null;
  private apiKey: string = "";
  private apiSecret: string = "";
  private priceSubscribers: Set<WebSocket> = new Set();
  private currentPrice: number = 34284.52;
  private priceStream: any = null;

  constructor(httpServer: HTTPServer) {
    this.wss = new WebSocketServer({ server: httpServer, path: "/ws/prices" });
    
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("[Binance] Client connected to price stream");
      this.priceSubscribers.add(ws);

      ws.on("close", () => {
        this.priceSubscribers.delete(ws);
        console.log("[Binance] Client disconnected from price stream");
      });

      // Send current price immediately
      ws.send(JSON.stringify({
        symbol: "BTCUSDT",
        price: this.currentPrice,
        timestamp: Date.now(),
      }));
    });
  }

  async connect(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    try {
      this.client = Binance({
        apiKey,
        apiSecret,
      });

      // Test connection
      const accountInfo = await this.client.accountInfo();
      console.log("[Binance] ✓ Connected successfully");
      console.log(`[Binance] Account: ${accountInfo.accountType} | Balance: ${accountInfo.balances.length} assets`);

      // Start price stream
      this.startPriceStream();

      return {
        connected: true,
        account: accountInfo.accountType,
        balances: accountInfo.balances.length,
      };
    } catch (error: any) {
      console.error("[Binance] Connection failed:", error.message);
      throw new Error(`Binance connection failed: ${error.message}`);
    }
  }

  private startPriceStream() {
    if (this.priceStream) return;

    console.log("[Binance] Starting price stream for BTCUSDT...");

    // Start Binance WebSocket price stream
    this.priceStream = this.client.ws.ticker({ symbol: "BTCUSDT" }, (ticker: any) => {
      this.currentPrice = parseFloat(ticker.bestAsk);

      // Broadcast to all connected clients
      this.priceSubscribers.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            symbol: "BTCUSDT",
            price: this.currentPrice,
            bid: parseFloat(ticker.bestBid),
            ask: parseFloat(ticker.bestAsk),
            volume24h: parseFloat(ticker.volume),
            percentChange: parseFloat(ticker.priceChangePercent),
            timestamp: Date.now(),
          }));
        }
      });
    });
  }

  async getPrice(symbol: string = "BTCUSDT") {
    try {
      if (!this.client) {
        return { price: this.currentPrice, timestamp: Date.now() };
      }

      const ticker = await this.client.dailyStats({ symbol });
      return {
        symbol,
        price: parseFloat(ticker.lastPrice),
        bid: parseFloat(ticker.bidPrice),
        ask: parseFloat(ticker.askPrice),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("[Binance] Failed to get price:", error);
      return { price: this.currentPrice, timestamp: Date.now() };
    }
  }

  async openFuturesPosition(symbol: string, side: "BUY" | "SELL", quantity: number, leverage: number = 20) {
    try {
      if (!this.client) throw new Error("Not connected to Binance");

      // Set leverage
      await this.client.futuresLeverage({ symbol, leverage });

      // Open position
      const order = await this.client.futuresOrder({
        symbol,
        side,
        type: "MARKET",
        quantity,
      });

      console.log(`[Binance] Opened ${side} position: ${quantity} ${symbol}`);
      return order;
    } catch (error: any) {
      console.error("[Binance] Failed to open position:", error.message);
      throw error;
    }
  }

  async closeFuturesPosition(symbol: string, positionSide: "LONG" | "SHORT") {
    try {
      if (!this.client) throw new Error("Not connected to Binance");

      const side = positionSide === "LONG" ? "SELL" : "BUY";
      const positions = await this.client.futuresPositionRisk({ symbol });
      const position = positions.find((p: any) => p.positionSide === positionSide);

      if (!position || parseFloat(position.positionAmt) === 0) {
        return { message: "No position to close" };
      }

      const order = await this.client.futuresOrder({
        symbol,
        side,
        type: "MARKET",
        quantity: Math.abs(parseFloat(position.positionAmt)),
      });

      console.log(`[Binance] Closed ${positionSide} position`);
      return order;
    } catch (error: any) {
      console.error("[Binance] Failed to close position:", error.message);
      throw error;
    }
  }

  async getOpenPositions(symbol: string = "BTCUSDT") {
    try {
      if (!this.client) return [];

      const positions = await this.client.futuresPositionRisk({ symbol });
      return positions.filter((p: any) => parseFloat(p.positionAmt) !== 0);
    } catch (error) {
      console.error("[Binance] Failed to get positions:", error);
      return [];
    }
  }

  isConnected(): boolean {
    return !!this.client;
  }

  getCurrentPrice(): number {
    return this.currentPrice;
  }

  disconnect() {
    if (this.priceStream) {
      this.priceStream();
      this.priceStream = null;
    }
    this.wss?.close();
    console.log("[Binance] Disconnected");
  }
}
