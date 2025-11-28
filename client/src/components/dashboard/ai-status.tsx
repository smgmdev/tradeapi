import { motion } from "framer-motion";
import { Brain, Activity, Zap, Database } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AIStatusPanel() {
  return (
    <Card className="terminal-panel p-0 relative overflow-hidden h-full flex flex-col">
       <div className="terminal-header">
        <div className="flex items-center gap-2">
          <Brain className="w-3 h-3" />
          <span>AI_INFERENCE_ENGINE</span>
        </div>
        <div className="text-[10px]">
          MODEL: <span className="text-primary">SCALPER_V4</span>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 gap-4 bg-black">
         {/* Left Column: Main Score */}
         <div className="flex flex-col justify-center items-center border border-white/10 bg-white/[0.02] relative">
            <div className="absolute top-1 left-1 text-[10px] text-muted-foreground font-mono">CONFIDENCE_SCORE</div>
            <div className="text-5xl font-mono font-bold text-primary tracking-tighter">87.4</div>
            <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-sm animate-pulse" />
               STRONG_BUY_SIGNAL
            </div>
         </div>

         {/* Right Column: Metrics */}
         <div className="flex flex-col gap-2 justify-center">
            <div className="space-y-1">
               <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>VOLATILITY_IDX</span>
                  <span className="text-orange-500">HIGH (72)</span>
               </div>
               <div className="h-1 bg-white/10 w-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[72%]" />
               </div>
            </div>

            <div className="space-y-1">
               <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>TREND_STRENGTH</span>
                  <span className="text-green-500">BULL (88)</span>
               </div>
               <div className="h-1 bg-white/10 w-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[88%]" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
               <div className="bg-white/[0.02] border border-white/5 p-1.5">
                  <div className="text-[9px] text-muted-foreground flex items-center gap-1">
                     <Zap className="w-2 h-2" /> EXEC_TIME
                  </div>
                  <div className="text-xs font-mono text-foreground">14ms</div>
               </div>
               <div className="bg-white/[0.02] border border-white/5 p-1.5">
                  <div className="text-[9px] text-muted-foreground flex items-center gap-1">
                     <Database className="w-2 h-2" /> DATA_PKT
                  </div>
                  <div className="text-xs font-mono text-foreground">2.4MB/s</div>
               </div>
            </div>
         </div>
      </div>
    </Card>
  );
}
