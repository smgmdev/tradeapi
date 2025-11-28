import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2, Crosshair, TrendingUp, BarChart } from "lucide-react";

const data = Array.from({ length: 100 }, (_, i) => {
  const base = 34200 + Math.random() * 500;
  return {
    time: `${10 + Math.floor(i / 60)}:${(i % 60).toString().padStart(2, '0')}`,
    value: base + Math.sin(i * 0.1) * 150 + (i * 5),
    vol: Math.random() * 1000,
  };
});

export function TradingChart() {
  return (
    <Card className="terminal-panel p-0 flex flex-col h-full min-h-[400px]">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <BarChart className="w-3 h-3" />
          <span>MARKET_OVERVIEW: BTCUSDT.P</span>
        </div>
        <div className="flex gap-4">
           <span>O: <span className="text-white">34,210.50</span></span>
           <span>H: <span className="text-green-500">34,892.10</span></span>
           <span>L: <span className="text-red-500">33,102.40</span></span>
           <span>C: <span className="bloomberg-orange">34,284.52</span></span>
        </div>
      </div>

      <div className="p-2 border-b border-white/10 bg-black flex justify-between items-center">
         <div className="flex gap-1">
            {["1m", "5m", "15m", "1h", "4h", "D", "W"].map(tf => (
              <button key={tf} className={`px-2 py-0.5 text-[10px] font-mono uppercase hover:bg-white/10 ${tf === '15m' ? 'bg-primary text-black font-bold' : 'text-muted-foreground'}`}>
                {tf}
              </button>
            ))}
         </div>
         <div className="flex gap-2 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Crosshair className="w-3 h-3" /> AUTO-SCALE</span>
         </div>
      </div>

      <div className="flex-1 w-full h-full min-h-0 bg-black relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
           <h1 className="text-9xl font-bold tracking-tighter">NEXUS</h1>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
            />
            <Area 
              type="step" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            <ReferenceLine y={34500} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'right',  value: 'RES', fill: 'red', fontSize: 10 }} />
            <ReferenceLine y={34000} stroke="hsl(var(--chart-3))" strokeDasharray="3 3" label={{ position: 'right',  value: 'SUP', fill: 'green', fontSize: 10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
