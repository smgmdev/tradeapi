import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const positions = [
  {
    symbol: "ETHUSDT",
    type: "LONG",
    leverage: "20x",
    size: "1.5 ETH",
    entryPrice: "1,824.50",
    markPrice: "1,832.10",
    pnl: "+11.40",
    pnlPercent: "+12.5%",
    margin: "166.95 USDT",
    status: "active"
  },
  {
    symbol: "SOLUSDT",
    type: "SHORT",
    leverage: "15x",
    size: "45 SOL",
    entryPrice: "42.80",
    markPrice: "42.95",
    pnl: "-6.75",
    pnlPercent: "-3.2%",
    margin: "128.40 USDT",
    status: "danger"
  }
];

export function PositionTable() {
  return (
    <Card className="glass-panel p-0 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-medium tracking-wide">ACTIVE POSITIONS (2)</h3>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          Total PNL: +$4.65
        </Badge>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-white/5 border-white/10">
              <TableHead className="text-xs font-mono text-muted-foreground">SYMBOL</TableHead>
              <TableHead className="text-xs font-mono text-muted-foreground">SIZE</TableHead>
              <TableHead className="text-xs font-mono text-muted-foreground">ENTRY / MARK</TableHead>
              <TableHead className="text-xs font-mono text-muted-foreground">MARGIN</TableHead>
              <TableHead className="text-xs font-mono text-muted-foreground text-right">PNL (ROE%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => (
              <TableRow key={pos.symbol} className="hover:bg-white/5 border-white/5 font-mono text-sm">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      {pos.symbol}
                      <span className={`text-[10px] px-1 rounded ${
                        pos.type === 'LONG' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {pos.leverage}
                      </span>
                    </span>
                    <span className={`text-xs font-bold ${
                      pos.type === 'LONG' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {pos.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{pos.size}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-foreground">{pos.entryPrice}</span>
                    <span className="text-xs text-muted-foreground">{pos.markPrice}</span>
                  </div>
                </TableCell>
                <TableCell>{pos.margin}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className={pos.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                      {pos.pnl} USDT
                    </span>
                    <span className={`text-xs ${
                      pos.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {pos.pnlPercent}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
