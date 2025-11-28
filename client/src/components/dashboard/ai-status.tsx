import { motion } from "framer-motion";
import { Brain, Activity, Zap, Database, Cpu, ShieldAlert, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AIStatusPanel() {
  return (
    <div className="flex flex-col bg-[#0b0e11]">
      <div className="p-3 border-b border-white/5">
         <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">ACTIVE MODEL</span>
            <span className="text-[10px] font-mono text-primary flex items-center gap-1">
              <Brain className="w-3 h-3" /> ANTI-MANIPULATION V2
            </span>
         </div>
         <div className="flex items-end justify-between">
             <div>
                <div className="text-2xl font-mono font-bold text-green-500 leading-none">94.2%</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">SCAM_PROTECTION</div>
             </div>
             <div className="text-right">
                <div className="text-xs font-mono font-bold text-foreground">ACTIVE</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">LIQUIDITY SWEEP</div>
             </div>
         </div>
      </div>
      
      <div className="p-3 space-y-3">
         {/* Smart Logic Indicators */}
         <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
               <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> FAKEOUT_PROBABILITY</span>
               <span className="text-red-500 font-bold">82% (HIGH)</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
               <div className="bg-red-500 h-full w-[82%] animate-pulse" />
            </div>
            <div className="text-[9px] text-red-400/80 font-mono">
               &gt;&gt; TRAP DETECTED: DO NOT ENTER LONG
            </div>
         </div>
         
         <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
               <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> WHALE_WALLET_TRACKING</span>
               <span className="text-blue-400">SCANNING</span>
            </div>
            <div className="flex gap-0.5 h-1.5">
               <div className="flex-1 bg-blue-500 rounded-sm opacity-100 animate-pulse" />
               <div className="flex-1 bg-blue-500 rounded-sm opacity-60" />
               <div className="flex-1 bg-blue-500 rounded-sm opacity-30" />
            </div>
         </div>
      </div>
    </div>
  );
}
