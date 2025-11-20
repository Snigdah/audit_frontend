// // App.tsx or NotificationComponent.tsx
// import { useWebSocket } from '../../hook/useWebSocket';
// import { useEffect, useState } from 'react';
// import { toast } from '../common/Toast';
// import AuthService from '../../services/AuthService';

// interface Notification {
//   message: string;
//   timestamp: number;
// }

// function NotificationComponent() {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const employeeId = AuthService.getEmployeeId();

//   const handleNotification = (notification: Notification) => {
//     console.log('New notification:', notification);
//     setNotifications(prev => [...prev, notification]);

//     // Show toast notification
//     toast.success(notification.message);
//   };

//   const { isConnected, error } = useWebSocket({
//     employeeId,
//     onMessage: handleNotification,
//   });

//   return (
//     <div>
//       <div className="connection-status">
//         {isConnected ? (
//           <span className="text-green-600">🟢 Connected</span>
//         ) : (
//           <span className="text-red-600">🔴 Disconnected</span>
//         )}
//         {error && <span className="text-red-500"> - {error}</span>}
//       </div>

//       <div className="notifications">
//         <h2>Notifications</h2>
//         {notifications.map((notif, idx) => (
//           <div key={idx} className="notification-item">
//             <p>{notif.message}</p>
//             <small>{new Date(notif.timestamp).toLocaleString()}</small>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default NotificationComponent;

import React, { useEffect, useState, type JSX } from "react";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import AuthService from "../../services/AuthService";

interface NotificationMessage {
  message: string;
  timestamp: number;
}

export default function Notifications(): JSX.Element {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const authToken = AuthService.getAccessToken();
  const employeeId = AuthService.getEmployeeId() || '';


  useEffect(() => {
    const stompClient: Client = new Client({
      brokerURL: `ws://localhost:8080/ws`,
      reconnectDelay: 5000,

      connectHeaders: {
        employeeId: employeeId,
        Authorization: `Bearer ${authToken}`,
      },

      onConnect: () => {
        console.log("✅ Connected as:", employeeId);
        setConnected(true);

        stompClient.subscribe(
          "/user/queue/notifications",
          (msg: IMessage) => {
            console.log("📬 Received user notification:", msg.body);

            try {
              const body: NotificationMessage = JSON.parse(msg.body);
              setMessages((prev) => [...prev, body]);
            } catch (e) {
              console.error("❌ Invalid JSON message:", e);
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
        setConnected(false);
      },

      onDisconnect: () => {
        console.log("🔌 Disconnected");
        setConnected(false);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [employeeId, authToken]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications for {employeeId}</h2>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      {messages.length === 0 ? (
        <p>No notifications yet...</p>
      ) : (
        messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p>{m.message}</p>
            <small>{new Date(m.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
