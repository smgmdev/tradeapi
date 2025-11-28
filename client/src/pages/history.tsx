import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History as HistoryIcon } from "lucide-react";

const tradeHistory = [
  { id: "TRD-5921", time: "2023-11-15 14:20:11", symbol: "BTCUSDT", side: "SELL", type: "MARKET", price: "36,420.50", amount: "0.015", realizedPnl: "+$42.50" },
  { id: "TRD-5920", time: "2023-11-15 12:15:44", symbol: "ETHUSDT", side: "BUY", type: "LIMIT", price: "1,980.20", amount: "1.200", realizedPnl: "-$12.40" },
  { id: "TRD-5919", time: "2023-11-15 09:40:30", symbol: "SOLUSDT", side: "BUY", type: "MARKET", price: "54.20", amount: "25.00", realizedPnl: "+$85.10" },
  { id: "TRD-5918", time: "2023-11-14 23:10:05", symbol: "BTCUSDT", side: "SELL", type: "STOP_LOSS", price: "35,900.00", amount: "0.020", realizedPnl: "-$15.00" },
  { id: "TRD-5917", time: "2023-11-14 18:05:12", symbol: "XRPUSDT", side: "BUY", type: "MARKET", price: "0.6240", amount: "1500.0", realizedPnl: "+$32.80" },
];

export default function History() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-4 h-full overflow-y-auto max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
           <HistoryIcon className="w-5 h-5 text-primary" />
           <h1 className="text-xl font-mono font-bold">TRADE_HISTORY_LOG</h1>
        </div>

        <Card className="bg-card border-white/10 overflow-hidden">
           <Table>
              <TableHeader className="bg-white/5">
                 <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="font-mono text-xs text-muted-foreground">TIME</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">SYMBOL</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">SIDE</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground">TYPE</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">AVG_PRICE</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">AMOUNT</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">REALIZED_PNL</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {tradeHistory.map((trade) => (
                    <TableRow key={trade.id} className="border-white/5 font-mono text-sm hover:bg-white/5">
                       <TableCell className="text-muted-foreground">{trade.time}</TableCell>
                       <TableCell className="font-bold text-foreground">{trade.symbol}</TableCell>
                       <TableCell className={trade.side === 'BUY' ? 'text-green-500' : 'text-red-500'}>{trade.side}</TableCell>
                       <TableCell className="text-muted-foreground">{trade.type}</TableCell>
                       <TableCell className="text-right text-foreground">{trade.price}</TableCell>
                       <TableCell className="text-right text-foreground">{trade.amount}</TableCell>
                       <TableCell className={`text-right font-bold ${trade.realizedPnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.realizedPnl}
                       </TableCell>
                    </TableRow>
                 ))}
              </TableBody>
           </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
