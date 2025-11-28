import { motion } from "framer-motion";
import { Brain, Activity, Zap, Database, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AIStatusPanel() {
  return (
    <div className="flex flex-col bg-[#0b0e11]">
      <div className="p-3 border-b border-white/5">
         <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Current Strategy</span>
            <span className="text-[10px] font-mono text-primary">SCALPER_MOMENTUM</span>
         </div>
         <div className="flex items-end justify-between">
             <div>
                <div className="text-2xl font-mono font-bold text-green-500 leading-none">87.4%</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">CONFIDENCE SCORE</div>
             </div>
             <div className="text-right">
                <div className="text-xs font-mono font-bold text-foreground">20x</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">LEVERAGE</div>
             </div>
         </div>
      </div>
      
      <div className="p-3 space-y-3">
         {/* Mini charts or bars */}
         <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
               <span>MARKET_VOLATILITY</span>
               <span className="text-orange-500">HIGH</span>
            </div>
            <div className="flex gap-0.5 h-1.5">
               <div className="flex-1 bg-orange-500 rounded-sm opacity-100" />
               <div className="flex-1 bg-orange-500 rounded-sm opacity-100" />
               <div className="flex-1 bg-orange-500 rounded-sm opacity-100" />
               <div className="flex-1 bg-orange-500 rounded-sm opacity-40" />
               <div className="flex-1 bg-orange-500 rounded-sm opacity-20" />
            </div>
         </div>
         
         <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
               <span>AI_PROCESSING_LOAD</span>
               <span className="text-blue-400">42%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
               <div className="bg-blue-500 h-full w-[42%]" />
            </div>
         </div>
      </div>
    </div>
  );
}
