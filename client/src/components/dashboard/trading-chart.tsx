import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ComposedChart, Bar } from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2, Crosshair, TrendingUp, BarChart, Zap } from "lucide-react";

export function TradingChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(34284.52);
  const [priceChange, setPriceChange] = useState(0);

  // Generate live real-time candles every second
  useEffect(() => {
    // Initialize with base data
    const initialData = Array.from({ length: 60 }, (_, i) => {
      const basePrice = 34200;
      return {
        time: `${String(Math.floor(i / 60)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
        open: basePrice + Math.random() * 200,
        close: basePrice + Math.random() * 200,
        high: basePrice + Math.random() * 300,
        low: basePrice + Math.random() * 100,
        volume: Math.random() * 1000,
      };
    });
    setChartData(initialData);

    // Real-time update every 1 second (scalping timeframe)
    const interval = setInterval(() => {
      setChartData(prev => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const basePrice = 34200;
        const newCandle = {
          time: timeStr,
          open: currentPrice,
          close: basePrice + Math.random() * 200,
          high: basePrice + 200 + Math.random() * 100,
          low: basePrice + Math.random() * 50,
          volume: Math.random() * 500 + 100,
        };
        
        // Update real-time price
        const newPrice = newCandle.close;
        setCurrentPrice(newPrice);
        setPriceChange(newPrice - 34284.52);

        // Keep last 120 seconds of data
        return [...prev.slice(-119), newCandle];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="terminal-panel p-0 flex flex-col h-full min-h-[400px]">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <BarChart className="w-3 h-3" />
          <span>SCALP_TERMINAL: BTCUSDT.P | TIMEFRAME: 1SEC</span>
        </div>
        <div className="flex gap-4 text-[10px]">
           <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> LIVE_TICK: <span className="text-green-500 font-bold animate-pulse">STREAMING</span></span>
           <span>PRICE: <span className="text-primary font-bold">${currentPrice.toFixed(2)}</span></span>
           <span className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-2 border-b border-white/10 bg-black flex justify-between items-center">
         <div className="flex gap-1">
            {["1s", "5s", "15s", "1m", "5m"].map(tf => (
              <button key={tf} className={`px-2 py-0.5 text-[10px] font-mono uppercase hover:bg-white/10 ${tf === '1s' ? 'bg-primary text-black font-bold' : 'text-muted-foreground'}`}>
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
        <span>VOL: {(chartData[chartData.length-1]?.volume || 0).toFixed(0)} | LAST_TICK: {new Date().toLocaleTimeString()}</span>
      </div>
    </Card>
  );
}
