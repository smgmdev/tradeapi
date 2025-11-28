import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createScalpingBot, getScalpingBot, type ScalpingConfig } from "./trading";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Trading Bot Routes
  
  // Start the scalping bot
  app.post("/api/bot/start", async (req, res) => {
    try {
      const { apiKey, apiSecret, exchange, leverage, positionSize, symbol, maxLoss, confidence } = req.body;

      if (!apiKey || !apiSecret || !exchange) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const scalpingConfig: ScalpingConfig = {
        config: {
          exchange: exchange as "binance" | "bybit",
          apiKey,
          apiSecret,
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
        }
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

  // Get live market price
  app.get("/api/market/price/:symbol", (req, res) => {
    const { symbol } = req.params;
    const bot = getScalpingBot();
    
    // If bot is running, return its current price
    // Otherwise return mock data
    const price = bot ? (bot as any).currentPrice || 34284.52 : 34284.52;
    
    res.json({
      symbol,
      price: price + (Math.random() - 0.5) * 2,
      timestamp: Date.now(),
      bid: price - 0.5,
      ask: price + 0.5,
    });
  });

  return httpServer;
}
