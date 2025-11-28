import { useEffect, useState } from "react";

export function useBinancePrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws/prices`;
        
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log("[WebSocket] Connected to Binance price stream");
          setConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.loading) {
              setLoading(true);
              setError(data.message);
              setPrice(null);
            } else if (data.error) {
              setError(data.message);
              setPrice(null);
              setLoading(false);
            } else if (data.price) {
              setPrice(parseFloat(data.price));
              setLoading(false);
              setError(null);
              setLastUpdate(Date.now());
            }
          } catch (e) {
            console.error("Failed to parse price message:", e);
          }
        };

        ws.onerror = (error) => {
          console.error("[WebSocket] Error:", error);
          setConnected(false);
        };

        ws.onclose = () => {
          console.log("[WebSocket] Disconnected, reconnecting in 3s...");
          setConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (error) {
        console.error("[WebSocket] Connection failed:", error);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  return { price, connected, loading, error, lastUpdate };
}
