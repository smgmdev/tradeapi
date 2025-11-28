import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Maximize2 } from "lucide-react";

const data = Array.from({ length: 50 }, (_, i) => {
  const base = 32000 + Math.random() * 1000;
  return {
    time: `${10 + Math.floor(i / 60)}:${(i % 60).toString().padStart(2, '0')}`,
    value: base + Math.sin(i * 0.2) * 200 + (i * 10),
    ma7: base + Math.sin(i * 0.2) * 200 + (i * 10) - 50,
    ma25: base + Math.sin(i * 0.2) * 200 + (i * 10) - 150,
  };
});

export function TradingChart() {
  return (
    <Card className="glass-panel p-6 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
              BTC/USDT
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-muted-foreground font-sans">PERP</span>
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-mono text-lg font-bold text-green-500">$34,284.52</span>
              <span className="text-xs text-muted-foreground">Mark Price</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4 border-l border-white/10 pl-4">
            <div>
              <div className="text-xs text-muted-foreground">24h Change</div>
              <div className="text-sm font-mono text-green-500 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +2.45%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">24h High</div>
              <div className="text-sm font-mono text-foreground">34,892.10</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">24h Low</div>
              <div className="text-sm font-mono text-foreground">33,102.40</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tabs defaultValue="15m" className="w-auto">
            <TabsList className="bg-black/20 border border-white/10 h-8">
              <TabsTrigger value="1m" className="text-xs h-6 px-2">1m</TabsTrigger>
              <TabsTrigger value="5m" className="text-xs h-6 px-2">5m</TabsTrigger>
              <TabsTrigger value="15m" className="text-xs h-6 px-2">15m</TabsTrigger>
              <TabsTrigger value="1h" className="text-xs h-6 px-2">1h</TabsTrigger>
              <TabsTrigger value="4h" className="text-xs h-6 px-2">4h</TabsTrigger>
            </TabsList>
          </Tabs>
          <button className="p-2 hover:bg-white/5 rounded-md text-muted-foreground">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))'
              }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="ma7" 
              stroke="hsl(var(--chart-1))" 
              fill="none" 
              strokeWidth={1}
              strokeDasharray="5 5"
            />
            <Area 
              type="monotone" 
              dataKey="ma25" 
              stroke="hsl(var(--chart-2))" 
              fill="none" 
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Order Book Visual (Mock) */}
      <div className="mt-4 h-2 bg-gradient-to-r from-red-500/50 via-transparent to-green-500/50 rounded-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-full" />
        <div className="absolute top-4 left-0 text-xs text-red-400">Sell Pressure</div>
        <div className="absolute top-4 right-0 text-xs text-green-400">Buy Pressure</div>
      </div>
    </Card>
  );
}
