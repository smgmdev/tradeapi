import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Lock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ApiKeysModal({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [bybitKey, setBybitKey] = useState("");
  const [bybitSecret, setBybitSecret] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("exchange-credentials");
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        setBybitKey(creds.bybitKey || "");
        setBybitSecret(creds.bybitSecret || "");
      } catch (e) {
        console.error("Failed to load credentials:", e);
      }
    }
  }, []);

  const handleConnect = async () => {
    if (!bybitKey.trim() || !bybitSecret.trim()) {
      setMessage("❌ Please fill in both API keys");
      return;
    }

    setIsConnecting(true);
    setMessage("🔄 Connecting...");

    try {
      const response = await fetch("/api/exchange/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: bybitKey,
          apiSecret: bybitSecret,
        }),
      });

      if (response.ok) {
        setMessage("✅ Connected! Closing...");
        localStorage.setItem(
          "exchange-credentials",
          JSON.stringify({
            bybitKey,
            bybitSecret,
            connectedExchange: "bybit",
          })
        );
        setTimeout(() => onOpenChange?.(false), 1000);
      } else {
        const error = await response.json();
        setMessage(`❌ Error: ${error.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }

    setIsConnecting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Connect Bybit API Keys
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="bybit-api" className="text-sm">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="bybit-api"
                value={bybitKey}
                onChange={(e) => setBybitKey(e.target.value)}
                placeholder="Enter Bybit API Key"
                className="bg-black/20 border-white/10 pr-10 font-mono text-sm"
              />
              <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3 top-3 opacity-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bybit-secret" className="text-sm">
              Secret Key
            </Label>
            <div className="relative">
              <Input
                id="bybit-secret"
                type="password"
                value={bybitSecret}
                onChange={(e) => setBybitSecret(e.target.value)}
                placeholder="Enter Bybit Secret Key"
                className="bg-black/20 border-white/10 pr-10 font-mono text-sm"
              />
              <Lock className="w-4 h-4 text-muted-foreground absolute right-3 top-3" />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded text-xs font-mono ${
              message.includes("✅")
                ? "bg-green-500/20 text-green-200"
                : message.includes("🔄")
                ? "bg-yellow-500/20 text-yellow-200"
                : "bg-red-500/20 text-red-200"
            }`}>
              {message}
            </div>
          )}

          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
            <div className="font-bold mb-1">Steps:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Log in to Bybit</li>
              <li>Go to Account Settings → API</li>
              <li>Create API Key with Futures permissions</li>
              <li>Paste your keys above</li>
            </ol>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isConnecting || !bybitKey.trim() || !bybitSecret.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-10"
          >
            {isConnecting ? "🔄 Connecting..." : "Connect Bybit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
