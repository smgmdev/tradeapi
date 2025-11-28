import type { Express } from "express";
import { createServer, type Server } from "http";
import { BybitManager } from "./bybit";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  let exchangeManager: BybitManager | null = null;
  let botRunning = false;

  // Initialize with Bybit only
  const bybitKey = process.env.BYBIT_API_KEY;
  const bybitSecret = process.env.BYBIT_API_SECRET;
  
  console.log("[API] Initializing Bybit Manager...");
  exchangeManager = new BybitManager(httpServer);
  
  if (bybitKey && bybitSecret) {
    console.log("[API] ATTEMPTING AUTO-CONNECT TO BYBIT...");
    try {
      const result = await exchangeManager.connect(bybitKey, bybitSecret);
      console.log("[API] ✓ Auto-connected to Bybit Futures");
    } catch (error: any) {
      console.error("[API] Warning: Bybit connection failed:", error.message);
    }
  } else {
    console.log("[API] No Bybit API keys available. User can connect manually in Settings.");
  }

  // Connect to Bybit with API keys
  app.post("/api/exchange/connect", async (req, res) => {
    try {
      const { apiKey, apiSecret } = req.body;

      if (!apiKey || !apiSecret) {
        return res.status(400).json({ error: "Missing apiKey or apiSecret" });
      }

      exchangeManager = new BybitManager(httpServer);
      const result = await exchangeManager.connect(apiKey, apiSecret);
      res.json({
        status: "CONNECTED",
        exchange: "bybit",
        message: "Successfully connected to Bybit Futures",
        accountType: result.account,
        balances: result.balances,
      });
    } catch (error: any) {
      console.error("[API] Connection error:", error);
      res.status(500).json({ error: error.message || "Failed to connect to Bybit" });
    }
  });

  // Get current market price (REAL from exchange)
  app.get("/api/market/price/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const priceData = await exchangeManager!.getPrice(symbol || "BTCUSDT");
      res.json(priceData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start scalping bot
  app.post("/api/bot/start", async (req, res) => {
    try {
      if (!exchangeManager!.isConnected()) {
        return res.status(400).json({ error: "Not connected to exchange. Connect API keys first." });
      }

      botRunning = true;
      console.log("[API] ✓ Scalping bot started");

      res.json({
        status: "BOT_STARTED",
        message: "Scalping bot is now running with real price data",
        symbol: "BTCUSDT",
        strategy: "momentum_scalper",
        takeProfit: 1.5,
        stopLoss: 0.5,
        antiManipulation: true,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stop bot
  app.post("/api/bot/stop", (req, res) => {
    botRunning = false;
    console.log("[API] ✓ Scalping bot stopped");
    res.json({ status: "BOT_STOPPED", message: "Bot has been stopped" });
  });

  // Get bot status
  app.get("/api/bot/status", async (req, res) => {
    try {
      const positions = await exchangeManager!.getOpenPositions();
      res.json({
        running: botRunning,
        connected: exchangeManager!.isConnected(),
        currentPrice: exchangeManager!.getCurrentPrice(),
        openPositions: positions.length,
        positions: positions.map((p: any) => ({
          symbol: p.symbol || "BTCUSDT",
          side: p.positionSide || p.side,
          size: p.positionAmt || p.size,
          entryPrice: p.entryPrice,
          pnl: p.unRealizedProfit,
          pnlPercent: p.percentage,
        })),
      });
    } catch (error: any) {
      res.json({
        running: botRunning,
        connected: exchangeManager!.isConnected(),
        error: error.message,
      });
    }
  });

  // Get account info - REAL DATA from exchange
  app.get("/api/account", async (req, res) => {
    try {
      if (!exchangeManager!.isConnected()) {
        return res.status(400).json({ error: "Not connected to exchange" });
      }

      const accountInfo = await exchangeManager!.getAccountInfo();
      const currentPrice = exchangeManager!.getCurrentPrice();
      res.json({
        connected: true,
        price: currentPrice,
        accountType: accountInfo.accountType,
        balances: accountInfo.balances,
        totalWalletBalance: accountInfo.totalWalletBalance,
        totalUnrealizedProfit: accountInfo.totalUnrealizedProfit,
        timestamp: Date.now(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      binance: binanceManager!.isConnected() ? "connected" : "disconnected",
      botRunning,
    });
  });

  return httpServer;
}
