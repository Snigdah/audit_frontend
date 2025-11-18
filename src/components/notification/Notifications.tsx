// App.tsx or NotificationComponent.tsx
import { useWebSocket } from '../../hook/useWebSocket';
import { useEffect, useState } from 'react';
import { toast } from '../common/Toast';
import AuthService from '../../services/AuthService';

interface Notification {
  message: string;
  timestamp: number;
}

function NotificationComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const employeeId = AuthService.getEmployeeId();

  const handleNotification = (notification: Notification) => {
    console.log('New notification:', notification);
    setNotifications(prev => [...prev, notification]);
    
    // Show toast notification
    toast.success(notification.message);
  };

  const { isConnected, error } = useWebSocket({
    employeeId,
    onMessage: handleNotification,
  });

  return (
    <div>
      <div className="connection-status">
        {isConnected ? (
          <span className="text-green-600">🟢 Connected</span>
        ) : (
          <span className="text-red-600">🔴 Disconnected</span>
        )}
        {error && <span className="text-red-500"> - {error}</span>}
      </div>

      <div className="notifications">
        <h2>Notifications</h2>
        {notifications.map((notif, idx) => (
          <div key={idx} className="notification-item">
            <p>{notif.message}</p>
            <small>{new Date(notif.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationComponent;