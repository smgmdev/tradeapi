import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const performanceData = [
  { day: "Mon", pnl: 120 },
  { day: "Tue", pnl: -40 },
  { day: "Wed", pnl: 85 },
  { day: "Thu", pnl: 210 },
  { day: "Fri", pnl: 150 },
  { day: "Sat", pnl: 45 },
  { day: "Sun", pnl: 90 },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        <h1 className="text-xl font-mono font-bold mb-4">MARKET_ANALYTICS</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-white/10 p-4 col-span-2">
            <h3 className="text-xs font-mono text-muted-foreground mb-4">7_DAY_PERFORMANCE_METRICS</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-card border-white/10 p-4">
              <h3 className="text-xs font-mono text-muted-foreground mb-2">WIN_RATE</h3>
              <div className="text-3xl font-mono font-bold text-green-500">68.4%</div>
              <div className="text-xs text-muted-foreground mt-1">Last 500 Trades</div>
            </Card>
            <Card className="bg-card border-white/10 p-4">
              <h3 className="text-xs font-mono text-muted-foreground mb-2">PROFIT_FACTOR</h3>
              <div className="text-3xl font-mono font-bold text-primary">2.14</div>
              <div className="text-xs text-muted-foreground mt-1">Gross Profit / Gross Loss</div>
            </Card>
            <Card className="bg-card border-white/10 p-4">
              <h3 className="text-xs font-mono text-muted-foreground mb-2">AVG_HOLD_TIME</h3>
              <div className="text-3xl font-mono font-bold text-foreground">14m</div>
              <div className="text-xs text-muted-foreground mt-1">Scalping Mode</div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
