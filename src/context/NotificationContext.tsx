import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import NotificationService from "../services/NotificationService";
import { useAuth } from "./AuthContext";

// Define the notification interface
interface Notification {
  userNotificationId: number;
  type: string;
  title: string;
  message: string;
  redirectUrl: string;
  metadata: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Define the context interface
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  addNotification: (notif: Notification) => void;
  markAsRead: (id: number) => void;
  markAllRead: () => void;
}

// Create context with proper type
const NotificationContext = createContext<NotificationContextType | null>(null);

// Props interface for NotificationProvider
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { authState } = useAuth(); 


  // Fetch from backend
  const loadNotifications = async (): Promise<void> => {
    // Only load if authenticated
    if (!authState.isAuthenticated) {
      return;
    }

    try {
      const response = await NotificationService.getAllNotifications();
      
      // Transform the API response to match your Notification interface
      const transformedNotifications: Notification[] = response.notifications.map(notif => ({
        userNotificationId: notif.notificationId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        redirectUrl: notif.redirectUrl,
        metadata: notif.metadata || {},
        isRead: notif.isRead,
        createdAt: notif.createdAt || new Date().toISOString()
      }));

      setNotifications(transformedNotifications);
      
      // Set unread count from API response
      setUnreadCount(response.unseenCount);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      // Optional: Add error handling state if needed
      throw error; // Re-throw if you want components to handle the error
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    if (authState.isAuthenticated) {
      loadNotifications();
    } else {
      // Clear when logged out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [authState.isAuthenticated]);
  
  // Add real-time message from WebSocket
  const addNotification = (notif: Notification): void => {
    setNotifications((prev) => [notif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  // Mark one as read
  const markAsRead = (id: number): void => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.userNotificationId === id ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  // Mark all as read
  const markAllRead = (): void => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loadNotifications,
        addNotification,
        markAsRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};