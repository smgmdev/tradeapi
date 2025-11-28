import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutList, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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

const openOrders = [
  { id: "ORD-1", symbol: "BTCUSDT", type: "LIMIT", side: "BUY", price: "34,150.00", amount: "0.005", filled: "0%" },
  { id: "ORD-2", symbol: "ETHUSDT", type: "STOP_MARKET", side: "SELL", price: "1,800.00", amount: "1.500", filled: "0%" }
];

export function PositionTable() {
  return (
    <div className="flex flex-col h-full bg-[#0b0e11]">
      <Tabs defaultValue="positions" className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-white/10 px-2 bg-card">
          <TabsList className="h-9 bg-transparent p-0 gap-4">
            <TabsTrigger 
              value="positions" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 font-mono text-xs"
            >
              POSITIONS (2)
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 font-mono text-xs"
            >
              OPEN ORDERS (2)
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 font-mono text-xs"
            >
              ORDER HISTORY
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4 text-[10px] font-mono text-muted-foreground">
            <span>MARGIN_RATIO: <span className="text-green-500">12.4%</span></span>
            <span>MAINT_MARGIN: <span className="text-white">295.35 USDT</span></span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto relative">
          <TabsContent value="positions" className="m-0 h-full absolute inset-0">
            <Table>
              <TableHeader className="bg-muted/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground w-[120px]">SYMBOL</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground">SIZE</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">ENTRY PRICE</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">MARK PRICE</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">LIQ. PRICE</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">MARGIN</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">PNL (ROE%)</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right w-[100px]">TP/SL</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right w-[80px]">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((pos, i) => (
                  <TableRow key={pos.id} className={`border-white/5 font-mono text-xs hover:bg-white/5 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        <div className={`w-0.5 h-3 ${pos.side === 'LONG' ? 'bg-green-500' : 'bg-red-500'}`} />
                        {pos.symbol}
                        <span className="text-[9px] px-1 rounded bg-white/10 text-muted-foreground font-normal">{pos.lev}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={pos.side === 'LONG' ? 'text-green-500' : 'text-red-500'}>
                        {pos.size}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{pos.entry}</TableCell>
                    <TableCell className="text-right text-foreground">{pos.mark}</TableCell>
                    <TableCell className="text-right text-orange-500">{pos.liq}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{pos.margin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end leading-none gap-1">
                        <span className={pos.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                          {pos.pnl}
                        </span>
                        <span className={`text-[9px] ${pos.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {pos.roe}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[10px] text-muted-foreground">
                      <div className="flex flex-col items-end leading-none gap-1">
                        <span className="text-foreground">{pos.tp}</span>
                        <span className="text-foreground">{pos.sl}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="text-[9px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-muted-foreground hover:text-white transition-colors">
                        CLOSE
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="orders" className="m-0 h-full absolute inset-0">
            <Table>
              <TableHeader className="bg-muted/20 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground">TIME</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground">SYMBOL</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground">TYPE</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground">SIDE</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">PRICE</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">AMOUNT</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">FILLED</TableHead>
                  <TableHead className="h-7 text-[10px] font-mono text-muted-foreground text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openOrders.map((ord) => (
                  <TableRow key={ord.id} className="border-white/5 font-mono text-xs hover:bg-white/5">
                    <TableCell className="text-muted-foreground">10:42:15</TableCell>
                    <TableCell className="font-bold text-foreground">{ord.symbol}</TableCell>
                    <TableCell className="text-muted-foreground">{ord.type}</TableCell>
                    <TableCell className={ord.side === 'BUY' ? 'text-green-500' : 'text-red-500'}>{ord.side}</TableCell>
                    <TableCell className="text-right text-foreground">{ord.price}</TableCell>
                    <TableCell className="text-right text-foreground">{ord.amount}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{ord.filled}</TableCell>
                    <TableCell className="text-right">
                      <button className="text-[9px] text-muted-foreground hover:text-red-500">CANCEL</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
