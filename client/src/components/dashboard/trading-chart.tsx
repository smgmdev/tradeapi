import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ComposedChart, Bar } from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2, Crosshair, TrendingUp, BarChart, Zap, AlertCircle, CheckCircle2 } from "lucide-react";

type Timeframe = "1s" | "5s" | "15s" | "1m" | "5m" | "10m" | "15m" | "30m";

export function TradingChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(34284.52);
  const [priceChange, setPriceChange] = useState(0);
  const [timeframe, setTimeframe] = useState<Timeframe>("1s");
  const [isConnected, setIsConnected] = useState(false);

  // Check if Binance is connected
  useEffect(() => {
    const stored = localStorage.getItem("exchange-credentials");
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        if (creds.binanceKey && creds.binanceSecret && creds.connectedExchange === "binance") {
          setIsConnected(true);
        }
      } catch (e) {}
    }
  }, []);

  const generateChartData = (tf: Timeframe) => {
    const intervals: Record<Timeframe, number> = {
      "1s": 1000,
      "5s": 5000,
      "15s": 15000,
      "1m": 60000,
      "5m": 300000,
      "10m": 600000,
      "15m": 900000,
      "30m": 1800000,
    };

    const candleCount: Record<Timeframe, number> = {
      "1s": 60, "5s": 60, "15s": 60, "1m": 60, "5m": 60, "10m": 48, "15m": 96, "30m": 96,
    };

    const count = candleCount[tf];
    const volatility: Record<Timeframe, number> = {
      "1s": 10, "5s": 20, "15s": 30, "1m": 50, "5m": 100, "10m": 150, "15m": 200, "30m": 300,
    };

    return Array.from({ length: count }, (_, i) => {
      const basePrice = 34200 + i * 5;
      const volatilityRange = volatility[tf];
      return {
        time: formatTime(i, tf),
        open: basePrice + (Math.random() - 0.5) * volatilityRange,
        close: basePrice + (Math.random() - 0.5) * volatilityRange,
        high: basePrice + Math.random() * volatilityRange,
        low: basePrice - Math.random() * volatilityRange,
        volume: Math.random() * 1000,
      };
    });
  };

  const formatTime = (index: number, tf: Timeframe) => {
    const now = new Date();
    const intervals: Record<Timeframe, number> = {
      "1s": 1, "5s": 5, "15s": 15, "1m": 60, "5m": 300, "10m": 600, "15m": 900, "30m": 1800,
    };

    const offsetMs = index * intervals[tf] * 1000;
    const date = new Date(now.getTime() - offsetMs);

    if (["1s", "5s", "15s"].includes(tf)) {
      return date.toLocaleTimeString();
    } else if (tf === "1m") {
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    const initialData = generateChartData(timeframe);
    setChartData(initialData);

    if (["1s", "5s"].includes(timeframe)) {
      const updateInterval = timeframe === "1s" ? 1000 : 5000;
      const interval = setInterval(() => {
        setChartData(prev => {
          const basePrice = 34200;
          const newCandle = {
            time: formatTime(0, timeframe),
            open: currentPrice,
            close: basePrice + (Math.random() - 0.5) * 20,
            high: basePrice + Math.random() * 30,
            low: basePrice - Math.random() * 15,
            volume: Math.random() * 500 + 100,
          };

          const newPrice = newCandle.close;
          setCurrentPrice(newPrice);
          setPriceChange(newPrice - 34284.52);

          return [...prev.slice(-119), newCandle];
        });
      }, updateInterval);

      return () => clearInterval(interval);
    } else {
      const lastCandle = initialData[initialData.length - 1];
      setCurrentPrice(lastCandle.close);
      setPriceChange(lastCandle.close - 34284.52);
    }
  }, [timeframe]);

  return (
    <Card className="terminal-panel p-0 flex flex-col h-full min-h-[400px]">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <BarChart className="w-3 h-3" />
          <span>SCALP_TERMINAL: BTCUSDT.P | TIMEFRAME: {timeframe.toUpperCase()}</span>
        </div>
        <div className="flex gap-4 text-[10px]">
          <span className="flex items-center gap-1">
            {isConnected ? (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-600">
                <CheckCircle2 className="w-3 h-3" /> BINANCE_CONNECTED
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-600">
                <AlertCircle className="w-3 h-3" /> SIMULATED_DATA
              </span>
            )}
          </span>
          <span>PRICE: <span className="text-primary font-bold">${currentPrice.toFixed(2)}</span></span>
          <span className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-2 border-b border-white/10 bg-black flex justify-between items-center">
        <div className="flex gap-1">
          {["1s", "5s", "15s", "1m", "5m", "10m", "15m", "30m"].map(tf => (
            <button 
              key={tf} 
              onClick={() => setTimeframe(tf as Timeframe)}
              className={`px-2 py-0.5 text-[10px] font-mono uppercase hover:bg-white/10 transition-colors ${
                timeframe === tf 
                  ? 'bg-primary text-black font-bold' 
                  : 'text-muted-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex gap-2 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><Crosshair className="w-3 h-3" /> AUTO-SCALE</span>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-0 bg-black relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
          <h1 className="text-9xl font-bold tracking-tighter">NEXUS</h1>
        </div>

        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                domain={['auto', 'auto']} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                orientation="right"
                fontFamily="JetBrains Mono"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: 0,
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono'
                }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                formatter={(value: any) => value?.toFixed(2)}
              />
              <Area 
                type="stepAfter" 
                dataKey="close" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorClose)" 
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Bar 
                dataKey="volume" 
                fill="hsl(var(--primary))"
                opacity={0.1}
                isAnimationActive={false}
              />
              <ReferenceLine y={34500} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'right', value: 'RES', fill: 'red', fontSize: 10 }} />
              <ReferenceLine y={34000} stroke="hsl(var(--chart-3))" strokeDasharray="3 3" label={{ position: 'right', value: 'SUP', fill: 'green', fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="p-2 bg-black border-t border-white/10 text-[10px] font-mono text-muted-foreground flex justify-between">
        <span>OHLC: O:{chartData[chartData.length-1]?.open?.toFixed(2)} H:{chartData[chartData.length-1]?.high?.toFixed(2)} L:{chartData[chartData.length-1]?.low?.toFixed(2)} C:{chartData[chartData.length-1]?.close?.toFixed(2)}</span>
        <span>VOL: {(chartData[chartData.length-1]?.volume || 0).toFixed(0)} | {isConnected ? "LIVE" : "SIMULATED"}</span>
      </div>
    </Card>
  );
}
