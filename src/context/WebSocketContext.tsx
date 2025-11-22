// src/context/WebSocketContext.tsx
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";

interface WebSocketContextType {
  isConnected?: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

// Named export for the provider
export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { authState } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.employeeId) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    client.onConnect = () => {
      console.log("WS Connected");

       client.subscribe("/user/queue/notifications", (msg) => {
          try {
            const notif = JSON.parse(msg.body);
            addNotification(notif);
          } catch (error) {
            console.error("Failed to parse notification:", error);
          }
        }
      );
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [authState.isAuthenticated, addNotification]);

  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Named export for the hook
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

// Default export (optional, for better HMR)
export default WebSocketProvider;