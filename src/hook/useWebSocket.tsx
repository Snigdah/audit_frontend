// hooks/useWebSocket.ts
import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

interface NotificationMessage {
  message: string;
  timestamp: number;
}

interface UseWebSocketProps {
  employeeId: string | null;
  onMessage: (notification: NotificationMessage) => void;
}

export const useWebSocket = ({ employeeId, onMessage }: UseWebSocketProps) => {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create STOMP client
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // Use ws:// for native WebSocket
      
      // Reconnect automatically
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        setError(null);

        // Subscribe to user-specific notifications
        client.subscribe(
          `/user/${employeeId}/queue/notifications`,
          (message) => {
            try {
              const notification: NotificationMessage = JSON.parse(message.body);
              onMessage(notification);
            } catch (err) {
              console.error('Failed to parse notification:', err);
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setError(frame.headers['message'] || 'Connection error');
        setIsConnected(false);
      },

      onWebSocketClose: () => {
        console.log('WebSocket Closed');
        setIsConnected(false);
      },

      onDisconnect: () => {
        console.log('Disconnected');
        setIsConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    // Cleanup on unmount
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [employeeId, onMessage]);

  return { isConnected, error };
};