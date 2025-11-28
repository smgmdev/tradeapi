import { useEffect, useRef, useState } from "react";
import { Terminal, Scroll, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "INFO" | "WARN" | "EXEC" | "ALGO";
  message: string;
  code?: string;
}

export function TerminalLog() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: "16:42:01", type: "INFO", message: "INIT_SEQUENCE_START", code: "SYS_BOOT" },
    { id: 2, timestamp: "16:42:01", type: "INFO", message: "CONNECTING_WS_STREAM >> wss://fstream.binance.com", code: "NET_IO" },
    { id: 3, timestamp: "16:42:02", type: "EXEC", message: "AUTH_HANDSHAKE_SUCCESS", code: "SEC_OK" },
    { id: 4, timestamp: "16:42:05", type: "ALGO", message: "LOADING_MODEL >> NEURAL_SCALPER_V4.bin", code: "AI_LOAD" },
    { id: 5, timestamp: "16:42:08", type: "ALGO", message: "MODEL_READY >> CONFIDENCE_THRESHOLD: 0.85", code: "AI_RDY" },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: LogEntry['type'][] = ["INFO", "ALGO", "EXEC", "WARN"];
      const msgs = [
        "SCANNING_TICKER >> BTCUSDT [VOL_SPIKE_DETECTED]",
        "CALCULATING_RSI_DIV >> INTERVAL: 5m >> VAL: 24.5",
        "ORDER_BOOK_IMBALANCE >> BUY_SIDE_PRESSURE >> +12.4%",
        "CHECKING_RISK_PARAMS >> MARGIN_UTIL: 12.5% >> OK",
        "AI_INFERENCE >> BULLISH_FLAG_PATTERN >> PROB: 78%"
      ];
      
      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('en-GB'),
        type: types[Math.floor(Math.random() * types.length)],
        message: msgs[Math.floor(Math.random() * msgs.length)],
        code: `OP_${Math.floor(Math.random() * 999)}`
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
      case "WARN": return "text-orange-500";
      case "ALGO": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="terminal-panel h-full flex flex-col overflow-hidden bg-black">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          <span>SYSTEM_LOG_STREAM</span>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-tight space-y-1"
        ref={scrollRef}
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 hover:bg-white/[0.03] p-0.5">
            <span className="text-muted-foreground/50 select-none">{log.timestamp}</span>
            <span className={`w-10 text-right font-bold ${getTypeColor(log.type)}`}>{log.type}</span>
            <span className="text-muted-foreground/70">|</span>
            <span className="text-muted-foreground/50 w-16">{log.code}</span>
            <span className="text-foreground flex-1 truncate">{log.message}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-primary mt-2 animate-pulse">
          <ChevronRight className="w-3 h-3" />
          <span className="w-2 h-4 bg-primary/50 block" />
        </div>
      </div>
    </Card>
  );
}
