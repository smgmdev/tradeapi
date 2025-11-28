import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const assets = [
  { coin: "USDT", total: "4,120.50", available: "2,840.10", inOrder: "1,280.40", value: "$4,120.50" },
  { coin: "BTC", total: "0.0054", available: "0.0054", inOrder: "0.0000", value: "$185.40" },
  { coin: "ETH", total: "0.1500", available: "0.0000", inOrder: "0.1500", value: "$274.20" },
  { coin: "BNB", total: "0.4500", available: "0.4500", inOrder: "0.0000", value: "$110.80" },
];

export default function Wallet() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-6 h-full overflow-y-auto max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-mono font-bold flex items-center gap-2">
            <WalletIcon className="w-5 h-5 text-primary" />
            WALLET_OVERVIEW
          </h1>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-green-600/20 text-green-500 border border-green-600/50 rounded text-xs font-bold flex items-center gap-2 hover:bg-green-600/30">
                <ArrowDownLeft className="w-4 h-4" /> DEPOSIT
             </button>
             <button className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-600/50 rounded text-xs font-bold flex items-center gap-2 hover:bg-red-600/30">
                <ArrowUpRight className="w-4 h-4" /> WITHDRAW
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <div className="text-xs font-mono text-muted-foreground mb-1">TOTAL_ASSET_VALUATION</div>
              <div className="text-3xl font-mono font-bold text-foreground">~ 4,690.90 <span className="text-sm text-muted-foreground">USDT</span></div>
           </Card>
           <Card className="p-6 bg-card border-white/10">
              <div className="text-xs font-mono text-muted-foreground mb-1">UNREALIZED_PNL</div>
              <div className="text-3xl font-mono font-bold text-green-500">+$124.80</div>
           </Card>
           <Card className="p-6 bg-card border-white/10">
              <div className="text-xs font-mono text-muted-foreground mb-1">MARGIN_BALANCE</div>
              <div className="text-3xl font-mono font-bold text-foreground">4,815.70 <span className="text-sm text-muted-foreground">USDT</span></div>
           </Card>
        </div>

        <Card className="bg-card border-white/10 overflow-hidden">
           <Table>
              <TableHeader className="bg-white/5">
                 <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="font-mono text-xs text-muted-foreground">ASSET</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">TOTAL</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">AVAILABLE</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">IN_ORDER</TableHead>
                    <TableHead className="font-mono text-xs text-muted-foreground text-right">BTC_VALUE</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {assets.map((asset) => (
                    <TableRow key={asset.coin} className="border-white/5 font-mono text-sm hover:bg-white/5">
                       <TableCell className="font-bold text-foreground">{asset.coin}</TableCell>
                       <TableCell className="text-right">{asset.total}</TableCell>
                       <TableCell className="text-right text-foreground">{asset.available}</TableCell>
                       <TableCell className="text-right text-muted-foreground">{asset.inOrder}</TableCell>
                       <TableCell className="text-right text-primary">{asset.value}</TableCell>
                    </TableRow>
                 ))}
              </TableBody>
           </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
