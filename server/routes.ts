import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCredentialSchema } from "@shared/schema";
import { BybitManager } from "./bybit";
import { BinanceManager } from "./binance";

let bybitManager: BybitManager | null = null;
let binanceManager: BinanceManager | null = null;
let activeExchange: "bybit" | "binance" = "bybit";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize managers
  bybitManager = new BybitManager(httpServer, true);
  binanceManager = new BinanceManager(httpServer);

  // Connect API keys
  app.post("/api/credentials/connect", async (req, res) => {
    try {
      const { apiKey, apiSecret, exchange = "bybit", isTestnet = true } = req.body;
      
      if (!apiKey || !apiSecret) {
        return res.status(400).json({ error: "Missing API credentials" });
      }

      try {
        if (exchange === "binance") {
          activeExchange = "binance";
          await binanceManager!.connect(apiKey, apiSecret);
          await storage.saveCredential({ apiKey, apiSecret, isTestnet: false });
          res.json({
            status: "connected",
            message: "Successfully connected to Binance",
            exchange: "binance",
          });
        } else {
          activeExchange = "bybit";
          await bybitManager!.connect(apiKey, apiSecret, isTestnet);
          await storage.saveCredential({ apiKey, apiSecret, isTestnet });
          res.json({
            status: "connected",
            message: "Successfully connected to Bybit",
            exchange: "bybit",
            isTestnet,
          });
        }
      } catch (error: any) {
        if (error.message.includes("Forbidden")) {
          await storage.saveCredential({ apiKey, apiSecret, isTestnet });
          res.status(202).json({
            status: "connected_with_warning",
            message: "Keys saved. Showing real-time market data from CoinGecko.",
            exchange,
            warning: "This server has network restrictions for exchange APIs",
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Fetch trading pairs
  app.get("/api/trading-pairs", async (req, res) => {
    try {
      const manager = activeExchange === "binance" ? binanceManager : bybitManager;
      
      if (!manager || !manager.isConnected()) {
        return res.status(400).json({ error: `Not connected to ${activeExchange}` });
      }

      const pairs = await manager.getTradingPairs();
      
      // Save to storage
      const insertPairs = pairs.map(p => ({
        symbol: p.symbol,
        category: p.category,
        lastPrice: p.lastPrice,
        change24h: p.change24h || "0",
        volume24h: p.volume24h || "0",
        timestamp: new Date().toISOString(),
      }));
      
      await storage.updateTradingPairs(insertPairs);
      
      res.json({ pairs, exchange: activeExchange });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get stored trading pairs
  app.get("/api/trading-pairs/cached", async (req, res) => {
    try {
      const pairs = await storage.getTradingPairs();
      res.json({ pairs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get current exchange
  app.get("/api/exchange/current", (req, res) => {
    res.json({ exchange: activeExchange });
  });

  return httpServer;
}
