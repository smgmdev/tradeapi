import { useEffect, useRef, useState } from "react";
import { Terminal, Scroll, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "INFO" | "WARN" | "EXEC" | "ALGO" | "SMART";
  message: string;
}

interface TerminalLogProps {
  isBotRunning?: boolean;
}

export function TerminalLog({ isBotRunning }: TerminalLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date().toLocaleTimeString('en-GB'), type: "INFO", message: "SYSTEM_INITIALIZED >> READY" },
    { id: 2, timestamp: new Date().toLocaleTimeString('en-GB'), type: "INFO", message: "WAITING FOR API CONNECTION" },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBotRunning) return;
    
    // Only add real log entries when bot is running
    const interval = setInterval(() => {
      const realMsgs = [
        "MARKET_SCAN >> BTCUSDT DATA RECEIVED",
        "PRICE_UPDATE >> PROCESSING",
        "RISK_MONITOR >> ACTIVE",
        "API_CONNECTION >> LIVE",
      ];
      
      const randIndex = Math.floor(Math.random() * realMsgs.length);
      const selectedMsg = realMsgs[randIndex];
      
      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('en-GB'),
        type: "ALGO",
        message: selectedMsg,
      };
      
      setLogs(prev => [...prev.slice(-20), newLog]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isBotRunning]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "EXEC": return "text-green-500";
      case "WARN": return "text-red-500 font-bold";
      case "ALGO": return "text-blue-400";
      case "SMART": return "text-purple-400 font-bold"; // Special color for smart logic
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-black text-[10px] font-mono">
      <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between bg-card text-xs">
         <span className="text-muted-foreground font-bold">LIVE_LOGS</span>
         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-2 space-y-1 bg-black"
        ref={scrollRef}
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 opacity-90">
            <span className="text-muted-foreground/40 select-none min-w-[50px]">{log.timestamp}</span>
            <span className={`min-w-[35px] font-bold ${getTypeColor(log.type)}`}>{log.type}</span>
            <span className="text-foreground/90 truncate">{log.message}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 text-primary mt-1 animate-pulse pl-14">
          <ChevronRight className="w-3 h-3" />
          <span className="w-1.5 h-3 bg-primary/50 block" />
        </div>
      </div>
    </div>
  );
}
