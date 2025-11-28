import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Settings, Activity, Shield, Zap, Menu, X, Bell, Terminal, BarChart2, Database, Wallet, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Terminal, label: "TRADE", href: "/" },
    { icon: BarChart2, label: "MARKETS", href: "/analytics" },
    { icon: Wallet, label: "WALLET", href: "/wallet" },
    { icon: History, label: "HISTORY", href: "/history" },
  ];

  return (
    <div className="h-screen bg-background text-foreground font-sans overflow-hidden flex flex-col relative selection:bg-primary/20">
      {/* Top Navigation Bar (Binance Style - Dense) */}
      <header className="h-12 bg-card border-b border-white/10 flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary fill-current" />
            <span className="font-mono font-bold text-lg tracking-tight text-foreground">NEXUS<span className="text-primary">.PRO</span></span>
          </div>
          
          {/* Main Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer flex items-center gap-2",
                    location === item.href 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Account Summary */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono bg-black/20 px-3 py-1.5 rounded border border-white/5">
             <div className="flex flex-col items-end leading-tight">
                <span className="text-muted-foreground text-[10px]">EST. BALANCE</span>
                <span className="font-bold text-foreground">4,284.52 USDT</span>
             </div>
             <div className="h-6 w-px bg-white/10" />
             <div className="flex flex-col items-end leading-tight">
                <span className="text-muted-foreground text-[10px]">24H PNL</span>
                <span className="font-bold text-green-500">+$124.80</span>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-primary/80 to-secondary/80 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
              AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - No padding for full terminal feel */}
      <main className="flex-1 overflow-hidden relative bg-[#0b0e11]">
        {children}
      </main>
      
      {/* Status Bar */}
      <footer className="h-6 bg-card border-t border-white/10 flex items-center justify-between px-2 text-[10px] font-mono text-muted-foreground shrink-0 z-50">
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               SYSTEM_OPERATIONAL
            </span>
            <span>WEBSOCKET: <span className="text-green-500">CONNECTED (14ms)</span></span>
         </div>
         <div className="flex items-center gap-4">
             <span>AI_MODEL: <span className="text-primary">SCALPER_V4_PRO</span></span>
             <span>RISK_MODE: <span className="text-orange-500">AGGRESSIVE</span></span>
         </div>
      </footer>
    </div>
  );
}
