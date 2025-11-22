import { createContext, useContext, useEffect, type ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";

export const WebSocketContext = createContext({});

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Only connect when user is authenticated
    if (!authState.isAuthenticated || !authState.employeeId) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    client.onConnect = () => {
      client.subscribe("/user/queue/notifications", (msg) => {
        try {
          const notifDTO = JSON.parse(msg.body);
          addNotification(notifDTO);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      });
    };

    // Start WebSocket
    client.activate();

    // Cleanup (MUST NOT be async)
    return () => {
      try {
        client.deactivate(); // safe to call without await
      } catch (e) {
        console.error("WebSocket cleanup error", e);
      }
    };
  }, [authState.isAuthenticated]); // clean dependency

  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
