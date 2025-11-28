import { useEffect, useRef, useState } from "react";
import { Terminal, Scroll } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "INFO" | "WARN" | "SUCCESS" | "ERROR" | "TRADE";
  message: string;
}

export function TerminalLog() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: "10:42:01", type: "INFO", message: "System initialized. Connecting to exchange websockets..." },
    { id: 2, timestamp: "10:42:03", type: "SUCCESS", message: "Connected to Binance Futures API." },
    { id: 3, timestamp: "10:42:05", type: "INFO", message: "Loading AI Model: Neural-Scalper-v4..." },
    { id: 4, timestamp: "10:42:08", type: "SUCCESS", message: "Model loaded successfully. Confidence threshold set to 75%." },
    { id: 5, timestamp: "10:42:15", type: "WARN", message: "Scanning pairs: BTCUSDT, ETHUSDT, SOLUSDT..." },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: Math.random() > 0.7 ? "TRADE" : "INFO",
        message: Math.random() > 0.7 
          ? "ANALYSIS: Bearish divergence detected on ETHUSDT (15m). Waiting for confirmation."
          : "SCAN: Volatility spike on SOLUSDT. Monitoring order book depth."
      };
      
      setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "SUCCESS": return "text-green-400";
      case "WARN": return "text-yellow-400";
      case "ERROR": return "text-red-400";
      case "TRADE": return "text-primary neon-text";
      default: return "text-blue-300";
    }
  };

  return (
    <Card className="glass-panel h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b border-white/10 bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">SYSTEM_LOGS</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 bg-black/40"
        ref={scrollRef}
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-muted-foreground select-none">[{log.timestamp}]</span>
            <span className={getTypeColor(log.type)}>{log.type}</span>
            <span className="text-foreground/80">{log.message}</span>
          </div>
        ))}
        <div className="animate-pulse text-primary">_</div>
      </div>
    </Card>
  );
}
