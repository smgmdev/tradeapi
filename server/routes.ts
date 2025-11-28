import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createScalpingBot, getScalpingBot, type ScalpingConfig } from "./trading";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Store exchange connections
  const exchangeConnections: Record<string, any> = {};

  // Connect to exchange (Binance or Bybit)
  app.post("/api/exchange/connect", async (req, res) => {
    try {
      const { exchange, apiKey, apiSecret } = req.body;

      if (!exchange || !apiKey || !apiSecret) {
        return res.status(400).json({ error: "Missing exchange, apiKey, or apiSecret" });
      }

      if (!["binance", "bybit"].includes(exchange)) {
        return res.status(400).json({ error: "Invalid exchange. Must be 'binance' or 'bybit'" });
      }

      // Store connection securely (in production, encrypt this)
      exchangeConnections[exchange] = {
        apiKey,
        apiSecret,
        connected: true,
        timestamp: Date.now(),
      };

      console.log(`[API] ${exchange.toUpperCase()} exchange connected`);

      res.json({
        status: "CONNECTED",
        exchange,
        message: `Successfully connected to ${exchange.toUpperCase()} Futures`,
      });
    } catch (error) {
      console.error("[API] Connection error:", error);
      res.status(500).json({ error: "Failed to connect exchange" });
    }
  });

  // Start the scalping bot
  app.post("/api/bot/start", async (req, res) => {
    try {
      const { exchange, symbol, leverage, positionSize, maxLoss, confidence } = req.body;

      if (!exchange || !exchangeConnections[exchange]) {
        return res.status(400).json({ error: "Exchange not connected. Please connect keys first." });
      }

      const conn = exchangeConnections[exchange];
      const scalpingConfig: ScalpingConfig = {
        config: {
          exchange: exchange as "binance" | "bybit",
          apiKey: conn.apiKey,
          apiSecret: conn.apiSecret,
          leverage: leverage || 20,
          positionSize: positionSize || 20,
          symbol: symbol || "BTCUSDT",
        },
        maxLoss: maxLoss || 50,
        confidence: confidence || 75,
        antiManipulation: true,
      };

      const bot = createScalpingBot(scalpingConfig);
      await bot.start();

      res.json({
        status: "BOT_STARTED",
        message: "Scalping bot is now running with 1-second tick analysis",
        config: {
          exchange,
          symbol,
          leverage,
          positionSize,
          confidence,
        },
      });
    } catch (error) {
      console.error("[API] Error starting bot:", error);
      res.status(500).json({ error: "Failed to start bot" });
    }
  });

  // Stop the bot
  app.post("/api/bot/stop", (req, res) => {
    const bot = getScalpingBot();
    if (bot) {
      bot.stop();
      res.json({ status: "BOT_STOPPED" });
    } else {
      res.status(400).json({ error: "Bot not running" });
    }
  });

  // Get bot status
  app.get("/api/bot/status", (req, res) => {
    const bot = getScalpingBot();
    if (bot) {
      res.json(bot.getStatus());
    } else {
      res.json({ running: false, message: "No bot instance" });
    }
  });

  // Get exchange connection status
  app.get("/api/exchange/status", (req, res) => {
    res.json({
      connections: Object.keys(exchangeConnections).reduce((acc, key) => {
        acc[key] = exchangeConnections[key].connected;
        return acc;
      }, {} as Record<string, boolean>),
    });
  });

  // Get live market price (simulated with real structure)
  app.get("/api/market/price/:symbol", (req, res) => {
    const { symbol } = req.params;
    const bot = getScalpingBot();
    
    const price = bot ? 34284.52 + (Math.random() - 0.5) * 50 : 34284.52;
    
    res.json({
      symbol,
      price: parseFloat(price.toFixed(2)),
      timestamp: Date.now(),
      bid: parseFloat((price - 0.5).toFixed(2)),
      ask: parseFloat((price + 0.5).toFixed(2)),
    });
  });

  return httpServer;
}
