import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AIStatusPanel } from "@/components/dashboard/ai-status";
import { TradingChart } from "@/components/dashboard/trading-chart";
import { PositionTable } from "@/components/dashboard/position-table";
import { TerminalLog } from "@/components/dashboard/terminal-log";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Play, Pause, Power, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [showKeysModal, setShowKeysModal] = useState(false);
  const [isBotRunning, setIsBotRunning] = useState(true);

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
             
             <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  className={`h-8 text-xs font-bold ${isBotRunning ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                  onClick={() => setIsBotRunning(!isBotRunning)}
                >
                  {isBotRunning ? <><Pause className="w-3 h-3 mr-1" /> PAUSE</> : <><Play className="w-3 h-3 mr-1" /> START</>}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs border-white/10 hover:bg-white/5"
                  onClick={() => setShowKeysModal(true)}
                >
                  <Settings className="w-3 h-3 mr-1" /> CONFIG
                </Button>
             </div>
          </div>

          {/* 2. AI Stats / Performance */}
          <div className="shrink-0 border-b border-white/10">
             <AIStatusPanel />
          </div>

          {/* 3. Order Book / Market Depth Simulator (Small) */}
          <div className="shrink-0 h-48 border-b border-white/10 flex flex-col">
             <div className="px-3 py-2 text-[10px] font-mono text-muted-foreground border-b border-white/5 flex justify-between">
                <span>ORDER_BOOK</span>
                <span>BTC/USDT</span>
             </div>
             <div className="flex-1 flex text-[10px] font-mono">
                <div className="flex-1 border-r border-white/5 p-1 space-y-0.5">
                   <div className="text-red-500 flex justify-between px-1"><span>34,285.50</span><span>0.52</span></div>
                   <div className="text-red-500/90 flex justify-between px-1"><span>34,285.00</span><span>1.20</span></div>
                   <div className="text-red-500/80 flex justify-between px-1"><span>34,284.80</span><span>0.15</span></div>
                   <div className="text-red-500/70 flex justify-between px-1"><span>34,284.60</span><span>5.40</span></div>
                   <div className="text-red-500/60 flex justify-between px-1"><span>34,284.50</span><span>2.10</span></div>
                </div>
                <div className="flex-1 p-1 space-y-0.5">
                   <div className="text-green-500 flex justify-between px-1"><span>34,284.20</span><span>0.85</span></div>
                   <div className="text-green-500/90 flex justify-between px-1"><span>34,284.10</span><span>3.10</span></div>
                   <div className="text-green-500/80 flex justify-between px-1"><span>34,284.00</span><span>1.50</span></div>
                   <div className="text-green-500/70 flex justify-between px-1"><span>34,283.50</span><span>0.25</span></div>
                   <div className="text-green-500/60 flex justify-between px-1"><span>34,283.20</span><span>4.20</span></div>
                </div>
             </div>
             <div className="p-1 text-center text-[11px] font-mono font-bold text-foreground border-t border-white/5">
                34,284.52 <span className="text-muted-foreground text-[9px]">$34,284.52</span>
             </div>
          </div>

          {/* 4. Terminal Logs (Fills remaining space) */}
          <div className="flex-1 min-h-0 bg-black">
            <TerminalLog />
          </div>

        </div>
      </div>

      <ApiKeysModal open={showKeysModal} onOpenChange={setShowKeysModal} />
    </DashboardLayout>
  );
}
