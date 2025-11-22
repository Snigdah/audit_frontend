import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import NotificationService from "../services/NotificationService";
import { useAuth } from "./AuthContext";
import type { NotificationDTO, NotificationResponse } from "../types/notification";

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

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  addNotification: (notif: NotificationDTO) => void;
  markAsRead: (id: number) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { authState } = useAuth();

  // Transform DTO → Internal type
  const transform = (notif: NotificationDTO): Notification => ({
    userNotificationId: notif.notificationId,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    redirectUrl: notif.redirectUrl,
    metadata: notif.metadata || {},
    isRead: notif.isRead,
    createdAt: notif.createdAt || new Date().toISOString(),
  });

  // Load initial notifications from REST API
  const loadNotifications = useCallback(async (): Promise<void> => {
    if (!authState.isAuthenticated) return;

    const response: NotificationResponse = await NotificationService.getAllNotifications();
    setNotifications(response.notifications.map(transform));
    setUnreadCount(response.unreadCount);
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [authState.isAuthenticated, loadNotifications]);

  // Add real-time notification from WebSocket
  const addNotification = (notifDTO: NotificationDTO): void => {
    const notif = transform(notifDTO);

    setNotifications(prev => {
      // Prevent duplicate
      const exists = prev.some(n => n.userNotificationId === notif.userNotificationId);
      if (exists) return prev;

      return [notif, ...prev];
    });

    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: number): void => {
    setNotifications(prev =>
      prev.map(n => (n.userNotificationId === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount(prev => Math.max(prev - 1, 0));
  };

  const markAllRead = (): void => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
};
