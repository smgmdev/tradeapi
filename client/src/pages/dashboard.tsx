import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AIStatusPanel } from "@/components/dashboard/ai-status";
import { TradingChart } from "@/components/dashboard/trading-chart";
import { PositionTable } from "@/components/dashboard/position-table";
import { TerminalLog } from "@/components/dashboard/terminal-log";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function Dashboard() {
  const [showKeysModal, setShowKeysModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        {/* Header / Actions for Mobile mainly, or quick access */}
        <div className="lg:col-span-12 flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowKeysModal(true)}
            className="border-primary/20 text-primary hover:bg-primary/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure API Keys
          </Button>
        </div>

        {/* Top Row: AI Status & Quick Stats */}
        <div className="lg:col-span-12">
          <AIStatusPanel />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 h-[500px]">
          <TradingChart />
        </div>

        {/* Sidebar: Terminal / Logs */}
        <div className="lg:col-span-4 h-[500px]">
          <TerminalLog />
        </div>

        {/* Bottom: Active Positions */}
        <div className="lg:col-span-12 h-[300px]">
          <PositionTable />
        </div>
      </div>

      <ApiKeysModal open={showKeysModal} onOpenChange={setShowKeysModal} />
    </DashboardLayout>
  );
}
