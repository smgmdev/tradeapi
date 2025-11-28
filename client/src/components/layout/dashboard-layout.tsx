import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Settings, Activity, Shield, Zap, Menu, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Terminal", href: "/" },
    { icon: Activity, label: "Analytics", href: "/analytics" },
    { icon: Shield, label: "Risk Management", href: "/risk" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden flex relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 glass-panel border-r border-white/5 flex flex-col transition-transform duration-300 lg:transform-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wider">NEXUS<span className="text-primary">AI</span></h1>
            <p className="text-xs text-muted-foreground font-mono">v2.4.0-BETA</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 cursor-pointer group",
                location === item.href 
                  ? "bg-primary/10 border border-primary/20 text-primary neon-text" 
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className={cn("w-5 h-5", location === item.href && "animate-pulse")} />
                <span className="font-medium tracking-wide">{item.label}</span>
                {location === item.href && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-green-500">SYSTEM ONLINE</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Latency</span>
              <span className="text-foreground">24ms</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
              <span>API</span>
              <span className="text-foreground">CONNECTED</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none z-0" />
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-background/50 backdrop-blur-sm flex items-center justify-between px-6 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-6 mr-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground font-mono">TOTAL BALANCE</span>
                <span className="font-mono font-bold text-lg text-foreground">$4,284.52</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground font-mono">PNL (24H)</span>
                <span className="font-mono font-bold text-green-500">+$124.80 (2.9%)</span>
              </div>
            </div>
            
            <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/5 hover:text-primary relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full shadow-[0_0_8px_var(--color-destructive)]" />
            </Button>
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border border-white/20" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 z-10 relative scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
