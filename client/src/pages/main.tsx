import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface TradingPair {
  id: string;
  symbol: string;
  category: string;
  lastPrice: string;
  change24h: string;
  volume24h: string;
}

export function MainPage() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isTestnet, setIsTestnet] = useState(true);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loadingPairs, setLoadingPairs] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/credentials/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, apiSecret, isTestnet }),
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
    setError("");
  };

  return (
    <div className="w-full min-h-screen bg-white font-mono text-xs text-black">
      {/* Header */}
      <div className="border-b border-black px-4 py-3 bg-black text-white">
        <h1 className="text-sm font-bold">BYBIT_FUTURES_TERMINAL</h1>
        <p className="text-xs opacity-70 mt-1">Real-time Trading Pairs Viewer</p>
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
                  <label className="block text-xs mb-1">API Key</label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Bybit API key"
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
                    placeholder="Enter your Bybit API secret"
                    className="w-full px-2 py-1 border border-black text-xs bg-white"
                    disabled={loading}
                  />
                </div>

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
                    <span className="opacity-70">Environment:</span> {isTestnet ? "TESTNET" : "LIVE"}
                  </div>
                  <div>
                    <span className="opacity-70">Pairs Loaded:</span> {pairs.length}
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
                {pairs.map((pair, idx) => (
                  <div
                    key={pair.id}
                    className={`flex text-xs border-b border-gray-300 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } hover:bg-yellow-100 transition-colors`}
                  >
                    <div className="flex-1 px-3 py-2 border-r border-gray-300 font-mono font-bold">
                      {pair.symbol}
                    </div>
                    <div className="w-24 px-3 py-2 border-r border-gray-300 uppercase text-xs opacity-70">
                      {pair.category}
                    </div>
                    <div className="w-32 px-3 py-2 border-r border-gray-300 text-right font-mono">
                      ${parseFloat(pair.lastPrice).toFixed(2)}
                    </div>
                    <div
                      className={`w-24 px-3 py-2 border-r border-gray-300 text-right font-mono ${
                        parseFloat(pair.change24h) >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {parseFloat(pair.change24h) >= 0 ? "+" : ""}
                      {parseFloat(pair.change24h).toFixed(2)}%
                    </div>
                    <div className="w-32 px-3 py-2 text-right font-mono opacity-70">
                      {parseFloat(pair.volume24h).toLocaleString("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      })}
                    </div>
                  </div>
                ))}
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

      {/* Meta tags update */}
      {typeof document !== "undefined" && (
        <>
          {!document.querySelector('meta[property="og:title"]') && (
            <>
              <meta property="og:title" content="Bybit Futures Terminal" />
              <meta name="twitter:title" content="Bybit Futures Terminal" />
              <meta
                property="og:description"
                content="Real-time futures trading pairs viewer powered by Bybit API"
              />
              <meta
                name="twitter:description"
                content="Real-time futures trading pairs viewer powered by Bybit API"
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
