import { useEffect, useRef, useState } from "react";
import { Terminal, Scroll, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "INFO" | "WARN" | "EXEC" | "ALGO" | "SMART";
  message: string;
}

export function TerminalLog() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: "16:42:01", type: "INFO", message: "INIT_ANTI_MANIPULATION_ENGINE" },
    { id: 2, timestamp: "16:42:01", type: "INFO", message: "CONNECTING_WS_STREAM" },
    { id: 3, timestamp: "16:42:02", type: "EXEC", message: "AUTH_HANDSHAKE_SUCCESS" },
    { id: 4, timestamp: "16:42:05", type: "ALGO", message: "LOADING_MODEL >> MM_TRAP_DETECTOR_V2.bin" },
    { id: 5, timestamp: "16:42:08", type: "ALGO", message: "MODEL_READY >> PROTECTION: ACTIVE" },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: LogEntry['type'][] = ["INFO", "ALGO", "EXEC", "WARN", "SMART"];
      const msgs = [
        "SCAN >> BTCUSDT [VOL_SPIKE]",
        "CALC >> RSI_DIV: 24.5",
        "SMART_CHECK >> FAKEOUT DETECTED (Probability: 88%)",
        "ABORT_TRADE >> REASON: Market Maker Trap Identified",
        "WHALE_ALERT >> 500 BTC Moved to Exchange",
        "LIQUIDITY_SWEEP >> Lows taken out, waiting for reversal...",
        "RISK_CHECK >> MARGIN: OK",
        "INFERENCE >> BEAR_TRAP DETECTED >> ENTERING LONG"
      ];
      
      const randIndex = Math.floor(Math.random() * msgs.length);
      const selectedMsg = msgs[randIndex];
      
      // Auto-assign type based on message content for better visuals
      let type: LogEntry['type'] = "INFO";
      if (selectedMsg.includes("FAKEOUT") || selectedMsg.includes("TRAP")) type = "SMART";
      else if (selectedMsg.includes("ABORT")) type = "WARN";
      else if (selectedMsg.includes("ENTER")) type = "EXEC";
      else if (selectedMsg.includes("SCAN") || selectedMsg.includes("CALC")) type = "ALGO";
      
      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('en-GB'),
        type: type,
        message: selectedMsg,
      };
      
      setLogs(prev => [...prev.slice(-20), newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
