import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Shield, Zap, Lock, Eye, Bell, Smartphone, Network, CheckCircle2, AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [binanceKey, setBinanceKey] = useState("");
  const [binanceSecret, setBinanceSecret] = useState("");
  const [bybitKey, setBybitKey] = useState("");
  const [bybitSecret, setBybitSecret] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedExchange, setConnectedExchange] = useState<"binance" | "bybit" | null>(null);

  const handleConnectBinance = async () => {
    if (!binanceKey || !binanceSecret) {
      toast({ title: "Error", description: "Please enter both API Key and Secret Key" });
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch("/api/exchange/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchange: "binance",
          apiKey: binanceKey,
          apiSecret: binanceSecret,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setConnectedExchange("binance");
        toast({ title: "Success", description: "Connected to Binance Futures! ✓" });
      } else {
        toast({ title: "Error", description: data.error || "Failed to connect" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Connection failed" });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectBybit = async () => {
    if (!bybitKey || !bybitSecret) {
      toast({ title: "Error", description: "Please enter both API Key and Secret Key" });
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch("/api/exchange/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchange: "bybit",
          apiKey: bybitKey,
          apiSecret: bybitSecret,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setConnectedExchange("bybit");
        toast({ title: "Success", description: "Connected to Bybit Futures! ✓" });
      } else {
        toast({ title: "Error", description: data.error || "Failed to connect" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Connection failed" });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-4xl mx-auto h-full overflow-y-auto">
        <h1 className="text-xl font-mono font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          SYSTEM_CONFIGURATION
        </h1>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-white/10 p-0 h-auto mb-6 gap-6">
            <TabsTrigger value="api" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">EXCHANGE_KEYS</TabsTrigger>
            <TabsTrigger value="trading" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">TRADING_LOGIC</TabsTrigger>
            <TabsTrigger value="risk" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">RISK_GUARD</TabsTrigger>
            <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 py-2 font-mono text-xs">GENERAL</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
             <Card className="p-6 bg-card border-white/10 space-y-6">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded flex gap-4">
                   <Network className="w-6 h-6 text-primary shrink-0" />
                   <div className="space-y-1">
                      <h3 className="font-mono text-sm font-bold text-primary">DUAL_EXCHANGE_VALIDATION_MODE</h3>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-foreground font-bold">Recommended:</span> Connect TWO exchanges. The AI will cross-reference prices and block scam trades.
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Exchange - Binance */}
                  <div className="space-y-4 p-4 border border-white/10 rounded bg-black/20">
                     <div className="flex items-center justify-between">
                        <Label className={`font-mono text-sm ${connectedExchange === "binance" ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {connectedExchange === "binance" ? "✓ BINANCE CONNECTED" : "BINANCE_FUTURES"}
                        </Label>
                        {connectedExchange === "binance" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">API Key</Label>
                        <Input 
                          type="password" 
                          placeholder="Enter Binance API Key" 
                          value={binanceKey}
                          onChange={(e) => setBinanceKey(e.target.value)}
                          className="bg-black border-white/10 font-mono h-8 text-xs" 
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Secret Key</Label>
                        <Input 
                          type="password" 
                          placeholder="Enter Binance Secret Key" 
                          value={binanceSecret}
                          onChange={(e) => setBinanceSecret(e.target.value)}
                          className="bg-black border-white/10 font-mono h-8 text-xs" 
                        />
                     </div>
                     <Button 
                       onClick={handleConnectBinance}
                       disabled={isConnecting}
                       className={`w-full font-mono text-xs h-8 ${connectedExchange === "binance" ? 'bg-green-600 hover:bg-green-500' : 'bg-primary hover:bg-primary/90'}`}
                     >
                       {isConnecting ? <><Loader className="w-3 h-3 animate-spin mr-2" /> CONNECTING...</> : connectedExchange === "binance" ? "✓ CONNECTED" : "CONNECT BINANCE"}
                     </Button>
                  </div>

                  {/* Secondary Exchange - Bybit */}
                  <div className="space-y-4 p-4 border border-white/10 rounded bg-black/20 opacity-80 hover:opacity-100 transition-opacity">
                     <div className="flex items-center justify-between">
                        <Label className={`font-mono text-sm ${connectedExchange === "bybit" ? 'text-blue-400' : 'text-muted-foreground'}`}>
                          {connectedExchange === "bybit" ? "✓ BYBIT CONNECTED" : "BYBIT_FUTURES (OPTIONAL)"}
                        </Label>
                        {connectedExchange === "bybit" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">API Key</Label>
                        <Input 
                          type="password" 
                          placeholder="Enter Bybit API Key (Optional)" 
                          value={bybitKey}
                          onChange={(e) => setBybitKey(e.target.value)}
                          className="bg-black border-white/10 font-mono h-8 text-xs" 
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Secret Key</Label>
                        <Input 
                          type="password" 
                          placeholder="Enter Bybit Secret Key (Optional)" 
                          value={bybitSecret}
                          onChange={(e) => setBybitSecret(e.target.value)}
                          className="bg-black border-white/10 font-mono h-8 text-xs" 
                        />
                     </div>
                     <Button 
                       onClick={handleConnectBybit}
                       disabled={isConnecting}
                       className={`w-full font-mono text-xs h-8 ${connectedExchange === "bybit" ? 'bg-blue-600 hover:bg-blue-500' : 'bg-secondary hover:bg-secondary/90'}`}
                     >
                       {isConnecting ? <><Loader className="w-3 h-3 animate-spin mr-2" /> CONNECTING...</> : connectedExchange === "bybit" ? "✓ CONNECTED" : "CONNECT BYBIT"}
                     </Button>
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded flex gap-3">
                   <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                   <div className="text-xs text-yellow-700">
                      <span className="font-bold">Security:</span> Your API keys are encrypted and stored securely. The bot uses read-only permissions - no withdrawal access.
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
             <Card className="p-6 bg-card border-white/10 space-y-6">
                <div className="space-y-4">
                   <Label className="font-mono text-sm text-primary">STRATEGY_SELECTION</Label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-primary/50 bg-primary/5 rounded cursor-pointer relative">
                         <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                         <div className="font-bold font-mono text-sm mb-1">MOMENTUM_SCALPER</div>
                         <div className="text-xs text-muted-foreground">High frequency, low timeframe (1m/5m). Captures small moves.</div>
                      </div>
                      <div className="p-4 border border-white/10 hover:border-white/30 bg-white/5 rounded cursor-pointer opacity-60">
                         <div className="font-bold font-mono text-sm mb-1">SWING_MASTER</div>
                         <div className="text-xs text-muted-foreground">Medium timeframe (1h/4h). Trend following logic.</div>
                      </div>
                      <div className="p-4 border border-white/10 hover:border-white/30 bg-white/5 rounded cursor-pointer opacity-60">
                         <div className="font-bold font-mono text-sm mb-1">GRID_BOT</div>
                         <div className="text-xs text-muted-foreground">Neutral market. Buys low, sells high in a range.</div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <Label className="font-mono text-sm">AI_SENSITIVITY</Label>
                   <div className="flex items-center gap-4">
                      <Slider defaultValue={[85]} max={100} step={1} className="flex-1" />
                      <span className="font-mono font-bold w-12 text-right">85%</span>
                   </div>
                   <p className="text-[10px] text-muted-foreground">Higher sensitivity means fewer, higher-confidence trades.</p>
                </div>
             </Card>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-6">
             <Card className="p-6 bg-card border-white/10 space-y-6">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-3">
                   <Shield className="w-5 h-5 text-red-500 shrink-0" />
                   <div>
                      <h4 className="text-sm font-bold text-red-500 font-mono">ANTI_MANIPULATION_ENGINE_V2</h4>
                      <p className="text-xs text-muted-foreground mt-1">Active protection against market maker stop-hunts and liquidity sweeps. Bot will auto-pause if volatility exceeds 300% of ATR.</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="font-mono text-sm">MAX_DAILY_LOSS</Label>
                      <div className="relative">
                         <Input className="bg-black/20 font-mono" placeholder="50.00" defaultValue="50.00" />
                         <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">USDT</span>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="font-mono text-sm">MAX_LEVERAGE</Label>
                      <div className="relative">
                         <Input className="bg-black/20 font-mono" placeholder="20" defaultValue="20" />
                         <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">x</span>
                      </div>
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card className="p-6 bg-card border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">DARK_MODE_THEME</Label>
                  <p className="text-xs text-muted-foreground">Enable high-contrast institutional dark mode.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">SOUND_ALERTS</Label>
                  <p className="text-xs text-muted-foreground">Play audible alerts on trade execution.</p>
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
