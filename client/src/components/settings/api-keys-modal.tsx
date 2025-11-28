import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Lock, CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function ApiKeysModal({ open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Bot Configuration
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="binance" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger value="binance">Binance</TabsTrigger>
            <TabsTrigger value="bybit">Bybit</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
          </TabsList>
          
          <TabsContent value="binance" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="binance-api">API Key</Label>
              <div className="relative">
                <Input id="binance-api" placeholder="Enter Binance API Key" className="bg-black/20 border-white/10 pr-10 font-mono" />
                <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3 top-3 opacity-0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="binance-secret">Secret Key</Label>
              <div className="relative">
                <Input id="binance-secret" type="password" placeholder="Enter Binance Secret Key" className="bg-black/20 border-white/10 pr-10 font-mono" />
                <Lock className="w-4 h-4 text-muted-foreground absolute right-3 top-3" />
              </div>
            </div>
            
            <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200">
              Ensure "Enable Futures" is checked in your API permissions.
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Connect Binance</Button>
          </TabsContent>
          
          <TabsContent value="bybit" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bybit-api">API Key</Label>
              <Input id="bybit-api" placeholder="Enter Bybit API Key" className="bg-black/20 border-white/10 font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bybit-secret">Secret Key</Label>
              <Input id="bybit-secret" type="password" placeholder="Enter Bybit Secret Key" className="bg-black/20 border-white/10 font-mono" />
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">Connect Bybit</Button>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Position Size (USDT)</Label>
                  <span className="text-xs font-mono text-primary">20 USDT</span>
                </div>
                <Slider defaultValue={[20]} max={100} step={1} className="py-2" />
                <p className="text-[10px] text-muted-foreground">Minimal trade amount per scalp.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max Leverage</Label>
                  <span className="text-xs font-mono text-red-400">20x</span>
                </div>
                <Slider defaultValue={[20]} max={50} step={1} className="py-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Take Profit %</Label>
                  <Input type="number" placeholder="1.5" className="bg-black/20 border-white/10 font-mono" defaultValue="1.5" />
                </div>
                <div className="space-y-2">
                  <Label>Stop Loss %</Label>
                  <Input type="number" placeholder="0.5" className="bg-black/20 border-white/10 font-mono" defaultValue="0.5" />
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                <div className="text-xs text-destructive-foreground">
                  <span className="font-bold">AI Auto-Hedge:</span> Bot will automatically open short positions if bearish divergence is &gt; 85%.
                </div>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Save Risk Parameters</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
