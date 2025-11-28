import { motion } from "framer-motion";
import { Brain, Activity, Zap, Database, Cpu, ShieldAlert, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AIStatusPanel() {
  return (
    <div className="flex flex-col bg-[#0b0e11]">
      <div className="p-3 border-b border-white/5">
         <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">SYSTEM STATUS</span>
            <span className="text-[10px] font-mono text-yellow-500 flex items-center gap-1">
              <Brain className="w-3 h-3" /> WAITING FOR API
            </span>
         </div>
         <div className="flex items-end justify-between">
             <div>
                <div className="text-2xl font-mono font-bold text-yellow-500 leading-none">N/A</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">PROTECTION_STATUS</div>
             </div>
             <div className="text-right">
                <div className="text-xs font-mono font-bold text-yellow-500">INACTIVE</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">BOT_STATE</div>
             </div>
         </div>
      </div>
      
      <div className="p-3 space-y-3">
         <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
               <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> MARKET_STATUS</span>
               <span className="text-yellow-500 font-bold">N/A</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
               <div className="bg-yellow-500 h-full w-0" />
            </div>
            <div className="text-[9px] text-yellow-400/80 font-mono">
               &gt;&gt; CONNECT API KEYS TO ACTIVATE
            </div>
         </div>
         
         <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
               <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> MONITORING</span>
               <span className="text-yellow-500">OFFLINE</span>
            </div>
            <div className="flex gap-0.5 h-1.5">
               <div className="flex-1 bg-yellow-500 rounded-sm opacity-30" />
               <div className="flex-1 bg-yellow-500 rounded-sm opacity-20" />
               <div className="flex-1 bg-yellow-500 rounded-sm opacity-10" />
            </div>
         </div>
      </div>
    </div>
  );
}
