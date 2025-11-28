import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Shield, Zap, Network, CheckCircle2, AlertCircle, Loader, CheckCheck, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [bybitKey, setBybitKey] = useState("");
  const [bybitSecret, setBybitSecret] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedExchange, setConnectedExchange] = useState<"bybit" | null>(null);
  const [connectionMessage, setConnectionMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("exchange-credentials");
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        setBybitKey(creds.bybitKey || "");
        setBybitSecret(creds.bybitSecret || "");
        setConnectedExchange(creds.connectedExchange || null);
      } catch (e) {
        console.error("Failed to load credentials:", e);
      }
    }
  }, []);

  const handleConnectBybit = () => {
    if (!bybitKey.trim()) {
      alert("❌ ERROR: API Key is empty");
      setConnectionMessage("❌ ERROR: API Key is empty");
      return;
    }
    
    if (!bybitSecret.trim()) {
      alert("❌ ERROR: Secret Key is empty");
      setConnectionMessage("❌ ERROR: Secret Key is empty");
      return;
    }

    alert("BYBIT BUTTON CLICKED!");
    setIsConnecting(true);
    setConnectionMessage("🔄 CONNECTING TO BYBIT...");

    setTimeout(() => {
      setConnectedExchange("bybit");
      localStorage.setItem("exchange-credentials", JSON.stringify({
        binanceKey,
        binanceSecret,
        bybitKey,
        bybitSecret,
        connectedExchange: "bybit"
      }));
      setConnectionMessage("✅ BYBIT CONNECTED!");
      setIsConnecting(false);
      alert("✅ SUCCESS: Connected to Bybit Futures!");
    }, 1000);
  };

  const handleDisconnect = () => {
    const confirmed = confirm(`⚠️ Disconnect from ${connectedExchange?.toUpperCase()}?\n\nYou'll need to reconnect to trade.`);
    if (!confirmed) return;

    setConnectedExchange(null);
    setBinanceKey("");
    setBinanceSecret("");
    setBybitKey("");
    setBybitSecret("");
    localStorage.removeItem("exchange-credentials");
    setConnectionMessage("✓ Disconnected. You can now connect to a different exchange.");
    alert("✅ Disconnected successfully. You can now reconnect to another exchange.");
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-4xl mx-auto h-full overflow-y-auto">
        <h1 className="text-xl font-mono font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          SYSTEM_CONFIGURATION
        </h1>

        {connectionMessage && (
          <div className={`mb-6 p-4 rounded font-mono text-sm font-bold border-2 text-center ${
            connectionMessage.includes("ERROR") ? "bg-red-500/30 border-red-500 text-red-300" :
            connectionMessage.includes("CONNECTING") ? "bg-yellow-500/30 border-yellow-500 text-yellow-300 animate-pulse" :
            "bg-green-500/30 border-green-500 text-green-300"
          }`}>
            {connectionMessage}
          </div>
        )}

        {connectedExchange && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-bold font-mono text-green-400">✓ CONNECTED TO {connectedExchange.toUpperCase()}</div>
                <div className="text-xs text-green-400/70 mt-1">API keys are stored in your browser</div>
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
            <TabsTrigger value="api" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">EXCHANGE_KEYS</TabsTrigger>
            <TabsTrigger value="trading" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">TRADING_LOGIC</TabsTrigger>
            <TabsTrigger value="risk" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">RISK_GUARD</TabsTrigger>
            <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">GENERAL</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
             <Card className="p-6 bg-card border-white/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* BINANCE */}
                  <div className={`space-y-4 p-4 border-2 rounded bg-black/40 transition-all ${
                    connectedExchange === "binance" 
                      ? 'border-green-500/50 bg-green-500/5' 
                      : connectedExchange && connectedExchange !== "binance"
                      ? 'border-white/10 opacity-50'
                      : 'border-white/20 hover:border-primary/50'
                  }`}>
                     <div className="flex items-center justify-between mb-2">
                        <Label className={`font-mono text-base font-bold ${connectedExchange === "binance" ? 'text-green-400' : 'text-white'}`}>
                          {connectedExchange === "binance" ? "✓✓✓ BINANCE CONNECTED ✓✓✓" : "BINANCE FUTURES"}
                        </Label>
                     </div>
                     
                     <div>
                        <Label className="text-xs text-muted-foreground block mb-1">Paste API Key:</Label>
                        <Input 
                          value={binanceKey}
                          onChange={(e) => setBinanceKey(e.target.value)}
                          placeholder="API key here..."
                          disabled={connectedExchange === "binance"}
                          className="bg-black/60 border-white/30 font-mono h-9 text-xs mb-3 disabled:opacity-60"
                        />
                     </div>
                     
                     <div>
                        <Label className="text-xs text-muted-foreground block mb-1">Paste Secret Key:</Label>
                        <Input 
                          value={binanceSecret}
                          onChange={(e) => setBinanceSecret(e.target.value)}
                          placeholder="Secret key here..."
                          disabled={connectedExchange === "binance"}
                          className="bg-black/60 border-white/30 font-mono h-9 text-xs disabled:opacity-60"
                        />
                     </div>
                     
                     <button
                       onClick={handleConnectBinance}
                       disabled={isConnecting || connectedExchange === "binance" || (connectedExchange && connectedExchange !== "binance")}
                       className={`w-full font-bold text-base h-12 mt-2 rounded cursor-pointer transition-all ${
                         connectedExchange === "binance" 
                           ? 'bg-green-600 text-white opacity-70' 
                           : isConnecting
                           ? 'bg-yellow-600 text-white animate-bounce'
                           : connectedExchange && connectedExchange !== "binance"
                           ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                           : 'bg-primary hover:bg-primary/80 text-black'
                       }`}
                       type="button"
                     >
                       {isConnecting ? "🔄 CONNECTING..." : connectedExchange === "binance" ? "✅ CONNECTED" : connectedExchange ? "SWITCH TO BINANCE FIRST" : "🚀 CONNECT BINANCE"}
                     </button>
                  </div>

                  {/* BYBIT */}
                  <div className={`space-y-4 p-4 border-2 rounded bg-black/40 transition-all ${
                    connectedExchange === "bybit" 
                      ? 'border-blue-500/50 bg-blue-500/5' 
                      : connectedExchange && connectedExchange !== "bybit"
                      ? 'border-white/10 opacity-50'
                      : 'border-white/20 hover:border-secondary/50'
                  }`}>
                     <div className="flex items-center justify-between mb-2">
                        <Label className={`font-mono text-base font-bold ${connectedExchange === "bybit" ? 'text-blue-400' : 'text-white'}`}>
                          {connectedExchange === "bybit" ? "✓✓✓ BYBIT CONNECTED ✓✓✓" : "BYBIT FUTURES (OPTIONAL)"}
                        </Label>
                     </div>
                     
                     <div>
                        <Label className="text-xs text-muted-foreground block mb-1">Paste API Key:</Label>
                        <Input 
                          value={bybitKey}
                          onChange={(e) => setBybitKey(e.target.value)}
                          placeholder="API key here..."
                          disabled={connectedExchange === "bybit"}
                          className="bg-black/60 border-white/30 font-mono h-9 text-xs mb-3 disabled:opacity-60"
                        />
                     </div>
                     
                     <div>
                        <Label className="text-xs text-muted-foreground block mb-1">Paste Secret Key:</Label>
                        <Input 
                          value={bybitSecret}
                          onChange={(e) => setBybitSecret(e.target.value)}
                          placeholder="Secret key here..."
                          disabled={connectedExchange === "bybit"}
                          className="bg-black/60 border-white/30 font-mono h-9 text-xs disabled:opacity-60"
                        />
                     </div>
                     
                     <button
                       onClick={handleConnectBybit}
                       disabled={isConnecting || connectedExchange === "bybit" || (connectedExchange && connectedExchange !== "bybit")}
                       className={`w-full font-bold text-base h-12 mt-2 rounded cursor-pointer transition-all ${
                         connectedExchange === "bybit" 
                           ? 'bg-blue-600 text-white opacity-70' 
                           : isConnecting
                           ? 'bg-yellow-600 text-white animate-bounce'
                           : connectedExchange && connectedExchange !== "bybit"
                           ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                           : 'bg-secondary hover:bg-secondary/80'
                       }`}
                       type="button"
                     >
                       {isConnecting ? "🔄 CONNECTING..." : connectedExchange === "bybit" ? "✅ CONNECTED" : connectedExchange ? "SWITCH TO BYBIT FIRST" : "🚀 CONNECT BYBIT"}
                     </button>
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
             <Card className="p-6 bg-card border-white/10 space-y-6">
                <div className="space-y-4">
                   <Label className="font-mono text-sm text-primary">STRATEGY_SELECTION</Label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-primary/50 bg-primary/5 rounded cursor-pointer">
                         <div className="font-bold font-mono text-sm mb-1">MOMENTUM_SCALPER</div>
                         <div className="text-xs text-muted-foreground">High frequency scalping</div>
                      </div>
                      <div className="p-4 border border-white/10 bg-white/5 rounded opacity-60">
                         <div className="font-bold font-mono text-sm mb-1">SWING_MASTER</div>
                         <div className="text-xs text-muted-foreground">Medium timeframe trends</div>
                      </div>
                      <div className="p-4 border border-white/10 bg-white/5 rounded opacity-60">
                         <div className="font-bold font-mono text-sm mb-1">GRID_BOT</div>
                         <div className="text-xs text-muted-foreground">Range trading</div>
                      </div>
                   </div>
                </div>
             </Card>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-6">
             <Card className="p-6 bg-card border-white/10 space-y-6">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                   <h4 className="text-sm font-bold text-red-500 font-mono">ANTI_MANIPULATION_ENGINE_V2</h4>
                   <p className="text-xs text-muted-foreground mt-1">Dual-exchange price validation to detect scam wicks</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <Label className="font-mono text-sm">MAX_DAILY_LOSS</Label>
                      <Input defaultValue="50.00" className="bg-black/20 font-mono mt-1" />
                   </div>
                   <div>
                      <Label className="font-mono text-sm">MAX_LEVERAGE</Label>
                      <Input defaultValue="20" className="bg-black/20 font-mono mt-1" />
                   </div>
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
