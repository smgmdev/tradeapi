import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutList } from "lucide-react";

const positions = [
  {
    id: "POS-1024",
    symbol: "ETHUSDT",
    side: "LONG",
    lev: "20x",
    size: "1.500",
    entry: "1,824.50",
    mark: "1,835.90",
    liq: "1,732.00",
    margin: "166.95",
    pnl: "+17.10",
    roe: "+10.24%",
    tp: "1,850.00",
    sl: "1,800.00"
  },
  {
    id: "POS-1025",
    symbol: "SOLUSDT",
    side: "SHORT",
    lev: "15x",
    size: "45.0",
    entry: "42.80",
    mark: "42.65",
    liq: "45.90",
    margin: "128.40",
    pnl: "+6.75",
    roe: "+5.25%",
    tp: "40.00",
    sl: "44.00"
  }
];

export function PositionTable() {
  return (
    <Card className="terminal-panel p-0 overflow-hidden flex flex-col h-full">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <LayoutList className="w-3 h-3" />
          <span>PORTFOLIO_POSITIONS</span>
        </div>
        <div className="text-[10px] font-normal">
          USED_MARGIN: <span className="text-white">295.35 USDT</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-black">
        <Table>
          <TableHeader className="bg-muted/20 sticky top-0">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground">SYMBOL</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground">SIDE</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground text-right">SIZE</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground text-right">ENTRY</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground text-right">MARK</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground text-right">LIQ</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground text-right">MARGIN</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground text-right">PNL (ROE%)</TableHead>
              <TableHead className="h-8 text-[10px] font-mono text-muted-foreground text-right">TP/SL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos, i) => (
              <TableRow key={pos.id} className={`border-white/5 font-mono text-xs hover:bg-white/5 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
                <TableCell className="font-bold text-primary">{pos.symbol}</TableCell>
                <TableCell>
                  <span className={pos.side === 'LONG' ? 'text-green-500' : 'text-red-500'}>
                    {pos.side} <span className="text-muted-foreground text-[10px]">x{pos.lev}</span>
                  </span>
                </TableCell>
                <TableCell className="text-right text-foreground">{pos.size}</TableCell>
                <TableCell className="text-right text-muted-foreground">{pos.entry}</TableCell>
                <TableCell className="text-right text-foreground">{pos.mark}</TableCell>
                <TableCell className="text-right text-orange-500">{pos.liq}</TableCell>
                <TableCell className="text-right text-muted-foreground">{pos.margin}</TableCell>
                <TableCell className="text-right">
                  <span className={pos.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {pos.pnl}
                  </span>
                  <span className={`ml-1 text-[10px] ${pos.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    ({pos.roe})
                  </span>
                </TableCell>
                <TableCell className="text-right text-[10px] text-muted-foreground">
                  <div className="flex flex-col items-end">
                    <span className="text-green-500/80">TP: {pos.tp}</span>
                    <span className="text-red-500/80">SL: {pos.sl}</span>
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
