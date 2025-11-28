import { motion } from "framer-motion";
import { Brain, Cpu, Wifi } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AIStatusPanel() {
  return (
    <Card className="glass-panel p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10" />
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-medium tracking-wide flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI SENTIMENT
          </h3>
          <p className="text-sm text-muted-foreground">Real-time market structure analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono font-bold text-primary">ACTIVE SCANNING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/5 relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center mb-3"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold font-mono text-primary">87%</span>
            </div>
          </motion.div>
          <span className="text-sm font-medium text-foreground">Confidence Score</span>
          <span className="text-xs text-muted-foreground mt-1 text-center">High probability setup detected</span>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground">
              <span>Trend Strength</span>
              <span className="text-green-400">Strong Bullish</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-transparent via-green-500 to-green-400" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground">
              <span>Volatility Index</span>
              <span className="text-yellow-400">Moderate</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "45%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-transparent via-yellow-500 to-yellow-400" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded bg-black/20 border border-white/5 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-secondary" />
              <div>
                <div className="text-xs text-muted-foreground">Processing</div>
                <div className="text-sm font-mono font-bold">1.2ms</div>
              </div>
            </div>
            <div className="p-3 rounded bg-black/20 border border-white/5 flex items-center gap-3">
              <Wifi className="w-4 h-4 text-secondary" />
              <div>
                <div className="text-xs text-muted-foreground">Data Stream</div>
                <div className="text-sm font-mono font-bold">Stable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
