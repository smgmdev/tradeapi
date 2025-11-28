import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCredentialSchema } from "@shared/schema";
import { BybitManager } from "./bybit";

let exchangeManager: BybitManager | null = null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Connect API keys
  app.post("/api/credentials/connect", async (req, res) => {
    try {
      const parsed = insertCredentialSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid credentials format" });
      }

      const { apiKey, apiSecret, isTestnet } = parsed.data;
      
      // Initialize manager if needed
      if (!exchangeManager) {
        exchangeManager = new BybitManager(httpServer, isTestnet);
      }

      // Try to connect and fetch pairs
      try {
        await exchangeManager.connect(apiKey, apiSecret, isTestnet);
        
        // Save credentials
        await storage.saveCredential({ apiKey, apiSecret, isTestnet });
        
        res.json({
          status: "connected",
          message: "Successfully connected to Bybit",
          isTestnet,
        });
      } catch (error: any) {
        if (error.message.includes("Forbidden")) {
          // Still save but warn about geo-blocking
          await storage.saveCredential({ apiKey, apiSecret, isTestnet });
          res.status(202).json({
            status: "connected_with_warning",
            message: "Keys saved. Real-time data limited due to network restrictions.",
            isTestnet,
            warning: "This server is geo-blocked from Bybit API",
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
      if (!exchangeManager || !exchangeManager.isConnected()) {
        return res.status(400).json({ error: "Not connected to Bybit" });
      }

      const pairs = await exchangeManager.getTradingPairs();
      
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
      
      res.json({ pairs });
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

  return httpServer;
}
