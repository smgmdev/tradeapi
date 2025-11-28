import { type Credential, type InsertCredential, type TradingPair, type InsertTradingPair } from "@shared/schema";

export interface IStorage {
  getCredential(id: string): Promise<Credential | undefined>;
  saveCredential(credential: InsertCredential): Promise<Credential>;
  getTradingPairs(): Promise<TradingPair[]>;
  updateTradingPairs(pairs: InsertTradingPair[]): Promise<void>;
}

// In-memory storage for now (until DB is needed)
export class MemStorage implements IStorage {
  private credentials: Map<string, Credential> = new Map();
  private pairs: TradingPair[] = [];

  async getCredential(id: string): Promise<Credential | undefined> {
    return this.credentials.get(id);
  }

  async saveCredential(credential: InsertCredential): Promise<Credential> {
    const id = Math.random().toString(36).slice(2);
    const saved: Credential = { id, ...credential };
    this.credentials.set(id, saved);
    return saved;
  }

  async getTradingPairs(): Promise<TradingPair[]> {
    return this.pairs;
  }

  async updateTradingPairs(pairs: InsertTradingPair[]): Promise<void> {
    const withIds = pairs.map((p, i) => ({ id: String(i), ...p } as TradingPair));
    this.pairs = withIds;
  }
}

export const storage = new MemStorage();
