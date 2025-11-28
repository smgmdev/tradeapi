import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AIStatusPanel } from "@/components/dashboard/ai-status";
import { TradingChart } from "@/components/dashboard/trading-chart";
import { PositionTable } from "@/components/dashboard/position-table";
import { TerminalLog } from "@/components/dashboard/terminal-log";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { useState, useEffect } from "react";
import { Settings, Play, Pause, Power, AlertCircle, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useBinancePrice } from "@/hooks/useBinancePrice";

export default function Dashboard() {
  const [showKeysModal, setShowKeysModal] = useState(false);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);
  const [exchangeName, setExchangeName] = useState("BYBIT");
  const { price, loading, error } = useBinancePrice();

  useEffect(() => {
    const stored = localStorage.getItem("exchange-credentials");
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        if (creds.bybitKey && creds.bybitSecret) {
          setHasKeys(true);
        }
      } catch (e) {
        console.error("Failed to load credentials:", e);
      }
    }
  }, []);

  const handleStartBot = () => {
    if (!hasKeys) {
      alert("❌ No API keys found!\n\nGo to Settings to connect Bybit first.");
      setShowKeysModal(true);
      return;
    }
    
    setIsBotRunning(true);
    alert(`🚀 BOT STARTED!\n\nScalping bot is now LIVE on ${exchangeName}.\n\nStarting 1-second market analysis...\n\nWatch the chart and logs for trades!`);
  };

  const handleStopBot = () => {
    setIsBotRunning(false);
    alert("⏹️ BOT STOPPED\n\nNo new trades will be executed.");
  };

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Market List (Collapsed for now or small) & Order Book could go here */}
        {/* For this specific "AI Bot" view, we will focus on the Chart & AI Logic */}

        {/* Center Column: Chart & Positions (Flexible Width) */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
          
          {/* Top: Trading Chart */}
          <div className="flex-1 min-h-0 relative">
            <TradingChart />
          </div>

          {/* Bottom: Positions / Orders Panel (Fixed Height) */}
          <div className="h-[35%] min-h-[200px] border-t border-white/10 bg-card">
            <PositionTable />
          </div>
        </div>

        {/* Right Column: AI Control & Logs (Fixed Width) */}
        <div className="w-80 flex flex-col shrink-0 bg-card border-l border-white/10 z-10">
          
          {/* 1. AI Control Header */}
          <div className="p-3 border-b border-white/10 bg-black/20">
             <div className="flex items-center justify-between mb-3">
               <span className="text-xs font-mono font-bold text-muted-foreground">BOT_CONTROLS</span>
               <div className={`w-2 h-2 rounded-full ${isBotRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
             </div>
             
             <div className="flex flex-col gap-2">
                {!isBotRunning ? (
                  <button 
                    onClick={handleStartBot}
                    className={`h-10 text-sm font-bold rounded px-3 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      hasKeys 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50' 
                        : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
                    }`}
                  >
                    <Play className="w-4 h-4" /> START BOT
                  </button>
                ) : (
                  <button 
                    onClick={handleStopBot}
                    className="h-10 text-sm font-bold rounded px-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Pause className="w-4 h-4" /> STOP BOT
                  </button>
                )}
                
                <button 
                  onClick={() => setShowKeysModal(true)}
                  className="h-8 text-xs font-bold rounded px-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Settings className="w-3 h-3" /> CONFIG
                </button>
             </div>

             {isBotRunning && (
               <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded text-[10px] font-mono text-green-400">
                 ✓ BOT IS LIVE {hasKeys && `on ${exchangeName}`}
               </div>
             )}

             {hasKeys && !isBotRunning && (
               <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-[10px] font-mono text-blue-400">
                 ✓ API Keys Connected ({exchangeName})
               </div>
             )}

             {!hasKeys && (
               <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-[10px] font-mono text-yellow-400 flex items-start gap-2">
                 <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                 <span>No API keys connected. Click CONFIG to add keys.</span>
               </div>
             )}
          </div>

          {/* 2. AI Stats / Performance */}
          <div className="shrink-0 border-b border-white/10">
             <AIStatusPanel />
          </div>

          {/* 3. Current Price Display (Real Data Only) */}
          <div className="shrink-0 h-48 border-b border-white/10 flex flex-col">
             <div className="px-3 py-2 text-[10px] font-mono text-muted-foreground border-b border-white/5 flex justify-between">
                <span>LIVE_PRICE</span>
                <span>BTC/USDT</span>
             </div>
             <div className="flex-1 flex items-center justify-center">
                {loading ? (
                   <div className="text-center">
                      <div className="text-2xl font-mono text-yellow-500 animate-pulse">⏳ LOADING</div>
                      <div className="text-[10px] text-muted-foreground mt-2">Fetching real market data...</div>
                   </div>
                ) : error ? (
                   <div className="text-center">
                      <div className="text-red-500 font-mono text-xs">{error}</div>
                      <div className="text-[10px] text-muted-foreground mt-2">Connect API keys in Settings</div>
                   </div>
                ) : price ? (
                   <div className="text-center">
                      <div className="text-5xl font-mono font-bold text-green-500">${price.toFixed(2)}</div>
                      <div className="text-[10px] text-muted-foreground mt-2">BTCUSDT (Real Bybit Price)</div>
                   </div>
                ) : (
                   <div className="text-center">
                      <div className="text-2xl font-mono text-yellow-500">⏳ WAITING</div>
                      <div className="text-[10px] text-muted-foreground mt-2">No data received yet</div>
                   </div>
                )}
             </div>
          </div>

          {/* 4. Terminal Logs (Fills remaining space) */}
          <div className="flex-1 min-h-0 bg-black">
            <TerminalLog isBotRunning={isBotRunning} />
          </div>

        </div>
      </div>

      <ApiKeysModal open={showKeysModal} onOpenChange={setShowKeysModal} />
    </DashboardLayout>
  );
}
