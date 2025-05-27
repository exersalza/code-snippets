import { useEffect, useRef, useState } from 'preact/hooks';

interface WebSocketConfig {
  url: string;
  onMessage: (data: string) => void;
  reconnectBaseDelay?: number;
  maxReconnectAttempts?: number;
  stopReconnecting?: boolean;
}

export function useWebSocket(config: WebSocketConfig) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const messageQueue = useRef<string[]>([]);

  function reconnect() {
    const baseDelay = config.reconnectBaseDelay || 1000;
    const maxAttempts = config.maxReconnectAttempts || 5;

    if (!(config.stopReconnecting ?? false) && reconnectAttempts.current >= maxAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    const delay = baseDelay * Math.max(Math.pow(2, reconnectAttempts.current), 64);
    setTimeout(connect, delay);
    reconnectAttempts.current++;
  }

  function connect() {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    ws.current = new WebSocket(config.url);

    ws.current.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      // yeet queued messages
      messageQueue.current.forEach(msg => ws.current?.send(msg));
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      config.onMessage(event.data);
    };

    ws.current.onclose = (event) => {
      setIsConnected(false);
      if (!event.wasClean) {
        reconnect();
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.current?.close();
    };
  }

  function sendMessage(message: string) {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      return
    }
    messageQueue.current.push(message);
  }

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.url]);

  return { sendMessage, isConnected };
}




/*
 *
 *
 *
import { useState } from 'preact/hooks';
import { useWebSocket } from './useWebSocket';

export function ChatComponent() {
  const [messages, setMessages] = useState<string[]>([]);

  const { sendMessage, isConnected } = useWebSocket({
    url: 'wss://your-socket-endpoint',
    onMessage: (data) => setMessages(prev => [...prev, data]),
  });

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <button onClick={() => sendMessage('ping')}>Send Test Message</button>
      <div>
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
    </div>
  );
}
  */
