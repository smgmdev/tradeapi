import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Settings, Activity, Shield, Zap, Menu, X, Bell, Terminal, BarChart2, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: Terminal, label: "TERMINAL", href: "/" },
    { icon: BarChart2, label: "MARKETS", href: "/analytics" },
    { icon: Shield, label: "RISK MGMT", href: "/risk" },
    { icon: Database, label: "DATA FEED", href: "/data" },
    { icon: Settings, label: "CONFIG", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden flex flex-col relative">
      {/* Top Navigation Bar (Bloomberg Style) */}
      <header className="h-10 bg-black border-b border-white/20 flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary flex items-center justify-center rounded-sm">
              <Zap className="w-4 h-4 text-black fill-current" />
            </div>
            <span className="font-mono font-bold tracking-wider text-primary">NEXUS<span className="text-white">TERMINAL</span></span>
          </div>
          
          <div className="h-4 w-px bg-white/20 mx-2" />
          
          <div className="hidden md:flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
             <span className="text-green-500">SYS: ONLINE</span>
             <span className="mx-2">|</span>
             <span className="text-primary">LATENCY: 12ms</span>
             <span className="mx-2">|</span>
             <span>API: BINANCE_FUTURES</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 border-r border-white/20 pr-6 mr-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted-foreground">NAV</span>
              <span className="text-foreground font-bold">$4,284.52</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted-foreground">D/PNL</span>
              <span className="text-green-500 font-bold">+$124.80</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-muted-foreground">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Slim Sidebar */}
        <aside className="w-14 bg-card border-r border-white/10 flex flex-col items-center py-4 z-40 shrink-0">
          <nav className="space-y-4 w-full flex flex-col items-center">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-sm transition-colors cursor-pointer",
                    location === item.href 
                      ? "bg-primary text-black" 
                      : "text-muted-foreground hover:text-white hover:bg-white/10"
                  )}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto w-full flex flex-col items-center gap-4">
             <div className="w-10 h-10 flex items-center justify-center rounded-sm text-destructive hover:bg-destructive/20 cursor-pointer">
                <Bell className="w-5 h-5" />
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative bg-background flex flex-col">
          {/* Ticker Tape */}
          <div className="h-6 bg-muted/30 border-b border-white/10 flex items-center overflow-hidden whitespace-nowrap">
             <div className="animate-marquee flex items-center gap-8 px-4 font-mono text-[10px] tracking-wider">
                <span className="text-muted-foreground">BTC/USDT <span className="text-green-500">34,284.50 ▲</span></span>
                <span className="text-muted-foreground">ETH/USDT <span className="text-red-500">1,824.20 ▼</span></span>
                <span className="text-muted-foreground">SOL/USDT <span className="text-green-500">42.80 ▲</span></span>
                <span className="text-muted-foreground">BNB/USDT <span className="text-green-500">245.10 ▲</span></span>
                <span className="text-muted-foreground">XRP/USDT <span className="text-red-500">0.5420 ▼</span></span>
                <span className="text-muted-foreground">ADA/USDT <span className="text-muted-foreground">0.2840 -</span></span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-1 md:p-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
