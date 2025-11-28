import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface TradingPair {
  id: string;
  symbol: string;
  category: string;
  lastPrice: string;
  change24h: string;
  volume24h: string;
}

interface PriceUpdate {
  symbol: string;
  price: number;
  percentChange: number;
  volume24h: number;
}

export function MainPage() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [exchange, setExchange] = useState<"bybit" | "binance">("bybit");
  const [isTestnet, setIsTestnet] = useState(true);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loadingPairs, setLoadingPairs] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState<Record<string, PriceUpdate>>({});
  const [wsConnected, setWsConnected] = useState(false);

  // Real-time WebSocket price stream
  useEffect(() => {
    if (!connected) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/prices`);

    ws.onopen = () => {
      console.log("[Frontend] Connected to real-time price stream");
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.symbol && data.price) {
          setPriceUpdates((prev) => ({
            ...prev,
            [data.symbol]: {
              symbol: data.symbol,
              price: data.price,
              percentChange: data.percentChange || 0,
              volume24h: data.volume24h || 0,
            },
          }));
        }
      } catch (e) {
        console.error("[Frontend] WebSocket parse error:", e);
      }
    };

    ws.onerror = () => {
      setWsConnected(false);
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    return () => ws.close();
  }, [connected]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/credentials/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          apiKey, 
          apiSecret, 
          exchange,
          isTestnet: exchange === "bybit" ? isTestnet : false 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Connection failed");
      }

      const data = await res.json();
      setConnected(true);
      setError("");

      // Fetch trading pairs
      await handleFetchPairs();
    } catch (err: any) {
      setError(err.message);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPairs = async () => {
    setLoadingPairs(true);
    try {
      const res = await fetch("/api/trading-pairs");
      if (!res.ok) throw new Error("Failed to fetch pairs");

      const data = await res.json();
      setPairs(data.pairs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingPairs(false);
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setApiKey("");
    setApiSecret("");
    setPairs([]);
    setPriceUpdates({});
    setError("");
  };

  // Get live price for a pair, fallback to static price
  const getLivePrice = (pair: TradingPair) => {
    const update = priceUpdates[pair.symbol];
    return update ? update.price.toFixed(2) : parseFloat(pair.lastPrice).toFixed(2);
  };

  const getLiveChange = (pair: TradingPair) => {
    const update = priceUpdates[pair.symbol];
    return update ? update.percentChange.toFixed(2) : parseFloat(pair.change24h).toFixed(2);
  };

  return (
    <div className="w-full min-h-screen bg-white font-mono text-xs text-black">
      {/* Header */}
      <div className="border-b border-black px-4 py-3 bg-black text-white">
        <h1 className="text-sm font-bold">BYBIT_FUTURES_TERMINAL</h1>
        <p className="text-xs opacity-70 mt-1">Real-time Trading Pairs Viewer</p>
        {wsConnected && connected && (
          <p className="text-xs text-green-400 mt-1 animate-pulse">🔴 LIVE PRICES STREAMING</p>
        )}
      </div>

      <div className="flex h-full">
        {/* Sidebar - Connection Panel */}
        <div className="w-80 border-r border-black bg-gray-50 p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-3 uppercase border-b border-black pb-2">
              API Connection
            </h2>

            {!connected ? (
              <form onSubmit={handleConnect} className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">Exchange</label>
                  <select
                    value={exchange}
                    onChange={(e) => setExchange(e.target.value as "bybit" | "binance")}
                    disabled={loading}
                    className="w-full px-2 py-1 border border-black text-xs bg-white"
                  >
                    <option value="bybit">Bybit</option>
                    <option value="binance">Binance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs mb-1">API Key</label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${exchange.toUpperCase()} API key`}
                    className="w-full px-2 py-1 border border-black text-xs bg-white"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">API Secret</label>
                  <input
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder={`Enter your ${exchange.toUpperCase()} API secret`}
                    className="w-full px-2 py-1 border border-black text-xs bg-white"
                    disabled={loading}
                  />
                </div>

                {exchange === "bybit" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="testnet"
                      checked={isTestnet}
                      onChange={(e) => setIsTestnet(e.target.checked)}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <label htmlFor="testnet" className="text-xs">
                      Use Testnet
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !apiKey || !apiSecret}
                  className="w-full px-3 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 uppercase"
                >
                  {loading ? "Connecting..." : "Connect"}
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">CONNECTED</span>
                </div>

                <div className="text-xs space-y-1 bg-white p-2 border border-black">
                  <div>
                    <span className="opacity-70">Exchange:</span> {exchange.toUpperCase()}
                  </div>
                  {exchange === "bybit" && (
                    <div>
                      <span className="opacity-70">Network:</span> {isTestnet ? "TESTNET" : "LIVE"}
                    </div>
                  )}
                  <div>
                    <span className="opacity-70">Pairs Loaded:</span> {pairs.length}
                  </div>
                  <div>
                    <span className="opacity-70">Stream:</span> {wsConnected ? "🟢 LIVE" : "🔴 OFFLINE"}
                  </div>
                </div>

                <button
                  onClick={handleFetchPairs}
                  disabled={loadingPairs}
                  className="w-full px-3 py-2 bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 disabled:opacity-50 uppercase"
                >
                  {loadingPairs ? "Refreshing..." : "Refresh Pairs"}
                </button>

                <button
                  onClick={handleDisconnect}
                  className="w-full px-3 py-2 bg-red-500 text-white text-xs font-bold hover:bg-red-600 uppercase"
                >
                  Disconnect
                </button>
              </div>
            )}

            {error && (
              <div className="mt-3 p-2 bg-red-100 border border-red-500 text-red-700 text-xs flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Trading Pairs Table */}
        <div className="flex-1 overflow-auto">
          {pairs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs opacity-50 mb-2">
                {connected ? "Click 'Refresh Pairs' to load trading pairs" : "Connect your API keys to view trading pairs"}
              </p>
            </div>
          ) : (
            <div className="border-collapse w-full">
              <div className="sticky top-0 bg-black text-white">
                <div className="flex text-xs font-bold border-b border-black">
                  <div className="flex-1 px-3 py-2 border-r border-black">SYMBOL</div>
                  <div className="w-24 px-3 py-2 border-r border-black">CATEGORY</div>
                  <div className="w-32 px-3 py-2 border-r border-black text-right">PRICE</div>
                  <div className="w-24 px-3 py-2 border-r border-black text-right">24H%</div>
                  <div className="w-32 px-3 py-2 text-right">VOLUME</div>
                </div>
              </div>

              <div>
                {pairs.map((pair, idx) => {
                  const livePrice = getLivePrice(pair);
                  const liveChange = getLiveChange(pair);
                  const hasUpdate = !!priceUpdates[pair.symbol];

                  return (
                    <div
                      key={pair.id}
                      className={`flex text-xs border-b border-gray-300 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } hover:bg-yellow-100 ${hasUpdate ? "bg-green-50" : ""}`}
                    >
                      <div className="flex-1 px-3 py-2 border-r border-gray-300 font-mono font-bold">
                        {pair.symbol}
                      </div>
                      <div className="w-24 px-3 py-2 border-r border-gray-300 uppercase text-xs opacity-70">
                        {pair.category}
                      </div>
                      <div className="w-32 px-3 py-2 border-r border-gray-300 text-right font-mono">
                        ${livePrice}
                        {hasUpdate && <span className="text-green-600 font-bold"> ●</span>}
                      </div>
                      <div
                        className={`w-24 px-3 py-2 border-r border-gray-300 text-right font-mono ${
                          parseFloat(liveChange) >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {parseFloat(liveChange) >= 0 ? "+" : ""}
                        {liveChange}%
                      </div>
                      <div className="w-32 px-3 py-2 text-right font-mono opacity-70">
                        {
                          hasUpdate
                            ? (priceUpdates[pair.symbol].volume24h / 1e9).toLocaleString("en-US", {
                                notation: "compact",
                                maximumFractionDigits: 1,
                              })
                            : parseFloat(pair.volume24h).toLocaleString("en-US", {
                                notation: "compact",
                                maximumFractionDigits: 1,
                              })
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {loadingPairs && (
            <div className="flex items-center justify-center gap-2 p-8">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Loading trading pairs...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
