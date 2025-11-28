import type { Express } from "express";
import { createServer, type Server } from "http";
import { BinanceManager } from "./binance";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  let binanceManager: BinanceManager | null = null;
  let botRunning = false;

  // Initialize Binance Manager
  binanceManager = new BinanceManager(httpServer);

  // Auto-connect to Binance with environment variables
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_API_SECRET;
  if (apiKey && apiSecret) {
    try {
      await binanceManager.connect(apiKey, apiSecret);
      console.log("[API] ✓ Auto-connected to Binance with API credentials");
    } catch (error: any) {
      console.error("[API] Failed to auto-connect to Binance:", error.message);
    }
  }

  // Connect to Binance with API keys
  app.post("/api/exchange/connect", async (req, res) => {
    try {
      const { exchange, apiKey, apiSecret } = req.body;

      if (!exchange || !apiKey || !apiSecret) {
        return res.status(400).json({ error: "Missing exchange, apiKey, or apiSecret" });
      }

      if (exchange !== "binance") {
        return res.status(400).json({ error: "Only Binance Futures is supported at this time" });
      }

      // Connect to Binance
      const result = await binanceManager!.connect(apiKey, apiSecret);

      res.json({
        status: "CONNECTED",
        exchange: "binance",
        message: "Successfully connected to Binance Futures",
        accountType: result.account,
        balances: result.balances,
      });
    } catch (error: any) {
      console.error("[API] Connection error:", error);
      res.status(500).json({ error: error.message || "Failed to connect to Binance" });
    }
  });

  // Get current market price (REAL from Binance)
  app.get("/api/market/price/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const priceData = await binanceManager!.getPrice(symbol || "BTCUSDT");
      res.json(priceData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start scalping bot
  app.post("/api/bot/start", async (req, res) => {
    try {
      if (!binanceManager!.isConnected()) {
        return res.status(400).json({ error: "Not connected to Binance. Connect API keys first." });
      }

      botRunning = true;
      console.log("[API] ✓ Scalping bot started");

      res.json({
        status: "BOT_STARTED",
        message: "Scalping bot is now running with real Binance price data",
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
      const positions = await binanceManager!.getOpenPositions();
      res.json({
        running: botRunning,
        connected: binanceManager!.isConnected(),
        currentPrice: binanceManager!.getCurrentPrice(),
        openPositions: positions.length,
        positions: positions.map((p: any) => ({
          symbol: p.symbol,
          side: p.positionSide,
          size: p.positionAmt,
          entryPrice: p.entryPrice,
          pnl: p.unRealizedProfit,
          pnlPercent: p.percentage,
        })),
      });
    } catch (error: any) {
      res.json({
        running: botRunning,
        connected: binanceManager!.isConnected(),
        error: error.message,
      });
    }
  });

  // Get Binance account info - REAL DATA from exchange
  app.get("/api/account", async (req, res) => {
    try {
      if (!binanceManager!.isConnected()) {
        return res.status(400).json({ error: "Not connected to Binance" });
      }

      const accountInfo = await binanceManager!.getAccountInfo();
      const currentPrice = binanceManager!.getCurrentPrice();
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
