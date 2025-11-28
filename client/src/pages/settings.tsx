import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Network, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [bybitKey, setBybitKey] = useState("");
  const [bybitSecret, setBybitSecret] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedExchange, setConnectedExchange] = useState<"bybit" | null>(null);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [useTestnet, setUseTestnet] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("exchange-credentials");
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        setBybitKey(creds.bybitKey || "");
        setBybitSecret(creds.bybitSecret || "");
        setConnectedExchange(creds.connectedExchange || null);
        setUseTestnet(creds.useTestnet !== false); // Default to testnet
      } catch (e) {
        console.error("Failed to load credentials:", e);
      }
    }
  }, []);

  const handleConnectBybit = async () => {
    if (!bybitKey.trim()) {
      setConnectionMessage("❌ ERROR: API Key is empty");
      return;
    }
    
    if (!bybitSecret.trim()) {
      setConnectionMessage("❌ ERROR: Secret Key is empty");
      return;
    }

    setIsConnecting(true);
    setConnectionMessage("🔄 CONNECTING TO BYBIT...");

    try {
      const response = await fetch("/api/exchange/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: bybitKey,
          apiSecret: bybitSecret,
          isTestnet: useTestnet,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConnectedExchange("bybit");
        localStorage.setItem(
          "exchange-credentials",
          JSON.stringify({
            bybitKey,
            bybitSecret,
            connectedExchange: "bybit",
            useTestnet,
          })
        );
        const mode = useTestnet ? "TESTNET" : "LIVE";
        setConnectionMessage(`✅ BYBIT ${mode} CONNECTED! Ready to trade.`);
        setIsConnecting(false);
      } else {
        const error = await response.json();
        setConnectionMessage(`❌ ERROR: ${error.error}`);
        setIsConnecting(false);
      }
    } catch (error: any) {
      setConnectionMessage(`❌ ERROR: ${error.message}`);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    const confirmed = confirm("⚠️ Disconnect from Bybit?\n\nYou'll need to reconnect to trade.");
    if (!confirmed) return;

    setConnectedExchange(null);
    setBybitKey("");
    setBybitSecret("");
    localStorage.removeItem("exchange-credentials");
    setConnectionMessage("✓ Disconnected. You can now reconnect.");
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-4xl mx-auto h-full overflow-y-auto">
        <h1 className="text-xl font-mono font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          SYSTEM_CONFIGURATION
        </h1>

        {connectionMessage && (
          <div
            className={`mb-6 p-4 rounded font-mono text-sm font-bold border-2 text-center ${
              connectionMessage.includes("ERROR")
                ? "bg-red-500/30 border-red-500 text-red-300"
                : connectionMessage.includes("CONNECTING")
                ? "bg-yellow-500/30 border-yellow-500 text-yellow-300 animate-pulse"
                : "bg-green-500/30 border-green-500 text-green-300"
            }`}
          >
            {connectionMessage}
          </div>
        )}

        {connectedExchange && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-bold font-mono text-green-400">
                  ✓ CONNECTED TO BYBIT {useTestnet ? "TESTNET" : "LIVE"}
                </div>
                <div className="text-xs text-green-400/70 mt-1">{useTestnet ? "📊 Testnet mode - paper trading" : "⚠️ Live trading - real money"}</div>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 rounded font-mono text-sm font-bold cursor-pointer transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" /> DISCONNECT
            </button>
          </div>
        )}

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-white/10 p-0 h-auto mb-6 gap-6">
            <TabsTrigger
              value="api"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs"
            >
              EXCHANGE_KEYS
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs"
            >
              GENERAL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
            <Card className="p-6 bg-card border-white/10 space-y-6">
              <div className="space-y-4 p-4 border-2 rounded bg-black/40 border-primary/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-primary" />
                    <Label className="font-mono text-lg font-bold text-primary">
                      BYBIT FUTURES
                    </Label>
                  </div>
                  {connectedExchange === "bybit" && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground block mb-2">
                    API Key:
                  </Label>
                  <Input
                    value={bybitKey}
                    onChange={(e) => setBybitKey(e.target.value)}
                    placeholder="Paste your Bybit API Key..."
                    disabled={connectedExchange === "bybit"}
                    className="bg-black/60 border-white/30 font-mono h-10 text-sm mb-4 disabled:opacity-60"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground block mb-2">
                    Secret Key:
                  </Label>
                  <Input
                    value={bybitSecret}
                    onChange={(e) => setBybitSecret(e.target.value)}
                    type="password"
                    placeholder="Paste your Bybit Secret Key..."
                    disabled={connectedExchange === "bybit"}
                    className="bg-black/60 border-white/30 font-mono h-10 text-sm disabled:opacity-60"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded bg-purple-500/10 border border-purple-500/30">
                  <Switch
                    checked={useTestnet}
                    onCheckedChange={setUseTestnet}
                    disabled={connectedExchange === "bybit"}
                  />
                  <Label className="text-xs font-mono cursor-pointer">
                    {useTestnet ? "📊 TESTNET MODE (Paper Trading)" : "⚠️ LIVE MODE (Real Money)"}
                  </Label>
                </div>

                <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
                  <div className="font-bold mb-1">How to get your API keys:</div>
                  <ol className="list-decimal list-inside space-y-1 text-blue-200/80">
                    <li>For Testnet: Go to <strong>testnet.bybit.com</strong></li>
                    <li>For Live: Go to <strong>bybit.com</strong></li>
                    <li>Enable "API Key Permissions"</li>
                    <li>Create new API key with Futures trading enabled</li>
                    <li>Copy and paste the keys above</li>
                    <li>Toggle Testnet/Live mode before connecting</li>
                  </ol>
                </div>

                <button
                  onClick={handleConnectBybit}
                  disabled={isConnecting || connectedExchange === "bybit"}
                  className={`w-full font-bold text-base h-12 mt-4 rounded cursor-pointer transition-all ${
                    connectedExchange === "bybit"
                      ? "bg-green-600 text-white opacity-70"
                      : isConnecting
                      ? "bg-yellow-600 text-white animate-pulse"
                      : "bg-primary hover:bg-primary/80 text-black"
                  }`}
                  type="button"
                >
                  {isConnecting
                    ? "🔄 CONNECTING..."
                    : connectedExchange === "bybit"
                    ? `✅ CONNECTED (${useTestnet ? "TESTNET" : "LIVE"})`
                    : `🚀 CONNECT BYBIT ${useTestnet ? "TESTNET" : "LIVE"}`}
                </button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card className="p-6 bg-card border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-mono text-sm">DARK_MODE</Label>
                  <p className="text-xs text-muted-foreground">High contrast theme</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-mono text-sm">SOUND_ALERTS</Label>
                  <p className="text-xs text-muted-foreground">Alert on trades</p>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
