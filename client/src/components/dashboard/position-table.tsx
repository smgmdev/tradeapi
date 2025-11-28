import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              POSITIONS
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 font-mono text-xs"
            >
              OPEN ORDERS
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 font-mono text-xs"
            >
              ORDER HISTORY
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4 text-[10px] font-mono text-muted-foreground">
            <span>MARGIN_RATIO: <span className="text-yellow-500">N/A</span></span>
            <span>MAINT_MARGIN: <span className="text-yellow-500">N/A</span></span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto relative flex items-center justify-center">
          <TabsContent value="positions" className="m-0 h-full absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-mono text-yellow-500 mb-2">No Positions</div>
              <div className="text-[10px] text-muted-foreground">Connect Bybit API keys and start trading</div>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="m-0 h-full absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-mono text-yellow-500 mb-2">No Open Orders</div>
              <div className="text-[10px] text-muted-foreground">Connect Bybit API keys and start trading</div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="m-0 h-full absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-mono text-yellow-500 mb-2">No Order History</div>
              <div className="text-[10px] text-muted-foreground">No trades executed yet</div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
