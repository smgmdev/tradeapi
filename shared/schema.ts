import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const credentials = pgTable("credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKey: text("api_key").notNull(),
  apiSecret: text("api_secret").notNull(),
  isTestnet: boolean("is_testnet").notNull().default(true),
});

export const tradingPairs = pgTable("trading_pairs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  category: text("category").notNull(), // "linear", "inverse"
  lastPrice: text("last_price").notNull(),
  change24h: text("change_24h"),
  volume24h: text("volume_24h"),
  timestamp: text("timestamp").notNull(),
});

export const insertCredentialSchema = createInsertSchema(credentials).pick({
  apiKey: true,
  apiSecret: true,
  isTestnet: true,
});

export const insertTradingPairSchema = createInsertSchema(tradingPairs).pick({
  symbol: true,
  category: true,
  lastPrice: true,
  change24h: true,
  volume24h: true,
  timestamp: true,
});

export type InsertCredential = z.infer<typeof insertCredentialSchema>;
export type Credential = typeof credentials.$inferSelect;
export type InsertTradingPair = z.infer<typeof insertTradingPairSchema>;
export type TradingPair = typeof tradingPairs.$inferSelect;
