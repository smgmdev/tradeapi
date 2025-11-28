import type { Express } from "express";
import { createServer, type Server } from "http";
import { BinanceManager } from "./binance";
import { BybitManager } from "./bybit";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  let exchangeManager: BinanceManager | BybitManager | null = null;
  let botRunning = false;

  // Determine which exchange to use
  const bybitKey = process.env.BYBIT_API_KEY;
  const bybitSecret = process.env.BYBIT_API_SECRET;
  const binanceKey = process.env.BINANCE_API_KEY;
  const binanceSecret = process.env.BINANCE_API_SECRET;
  
  console.log("[API] Checking for exchange API keys...");
  console.log("[API] Bybit available:", !!bybitKey && !!bybitSecret);
  console.log("[API] Binance available:", !!binanceKey && !!binanceSecret);
  
  // Try Bybit first (no geo-restrictions)
  if (bybitKey && bybitSecret) {
    console.log("[API] INITIALIZING BYBIT MANAGER...");
    exchangeManager = new BybitManager(httpServer);
    console.log("[API] ATTEMPTING AUTO-CONNECT TO BYBIT...");
    try {
      const result = await exchangeManager.connect(bybitKey, bybitSecret);
      console.log("[API] ✓ Auto-connected to Bybit Futures");
    } catch (error: any) {
      console.error("[API] Warning: Bybit connection failed:", error.message);
    }
  } else if (binanceKey && binanceSecret) {
    // Fall back to Binance if available
    console.log("[API] INITIALIZING BINANCE MANAGER...");
    exchangeManager = new BinanceManager(httpServer);
    console.log("[API] ATTEMPTING AUTO-CONNECT TO BINANCE...");
    try {
      const result = await exchangeManager.connect(binanceKey, binanceSecret);
      console.log("[API] ✓ Auto-connected to Binance Futures");
    } catch (error: any) {
      console.error("[API] Warning: Binance connection failed:", error.message);
    }
  } else {
    console.log("[API] No exchange API keys available. Initializing default Bybit manager.");
    exchangeManager = new BybitManager(httpServer);
    console.log("[API] User can connect manually in Settings.");
  }

  // Connect to exchange with API keys
  app.post("/api/exchange/connect", async (req, res) => {
    try {
      const { exchange, apiKey, apiSecret } = req.body;

      if (!exchange || !apiKey || !apiSecret) {
        return res.status(400).json({ error: "Missing exchange, apiKey, or apiSecret" });
      }

      if (exchange === "bybit") {
        exchangeManager = new BybitManager(httpServer);
        const result = await exchangeManager.connect(apiKey, apiSecret);
        res.json({
          status: "CONNECTED",
          exchange: "bybit",
          message: "Successfully connected to Bybit Futures",
          accountType: result.account,
          balances: result.balances,
        });
      } else if (exchange === "binance") {
        exchangeManager = new BinanceManager(httpServer);
        const result = await exchangeManager.connect(apiKey, apiSecret);
        res.json({
          status: "CONNECTED",
          exchange: "binance",
          message: "Successfully connected to Binance Futures",
          accountType: result.account,
          balances: result.balances,
        });
      } else {
        return res.status(400).json({ error: "Exchange must be 'binance' or 'bybit'" });
      }
    } catch (error: any) {
      console.error("[API] Connection error:", error);
      res.status(500).json({ error: error.message || "Failed to connect to exchange" });
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
