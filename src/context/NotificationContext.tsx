import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
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
  toggleNotificationRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { authState } = useAuth();

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

  const loadNotifications = useCallback(async () => {
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

  const addNotification = (notifDTO: NotificationDTO) => {
    const notif = transform(notifDTO);
    setNotifications((prev) => {
      const exists = prev.some(n => n.userNotificationId === notif.userNotificationId);
      if (exists) return prev;
      return [notif, ...prev];
    });
    setUnreadCount((prev) => prev + 1);
  };

  const toggleNotificationRead = async (id: number) => {
    const target = notifications.find(n => n.userNotificationId === id);
    if (!target) return;
    const wasRead = target.isRead;

    setNotifications(prev =>
      prev.map(n =>
        n.userNotificationId === id ? { ...n, isRead: !n.isRead } : n
      )
    );
    setUnreadCount(prev => wasRead ? prev + 1 : Math.max(prev - 1, 0));

    try {
      await NotificationService.updateNotification(id);
    } catch (error) {
      console.error("Failed to update notification:", error);
      // rollback
      setNotifications(prev =>
        prev.map(n =>
          n.userNotificationId === id ? { ...n, isRead: wasRead } : n
        )
      );
      setUnreadCount(prev => wasRead ? Math.max(prev - 1, 0) : prev + 1);
    }
  };

  const deleteNotification = async (id: number) => {
    const exists = notifications.find(n => n.userNotificationId === id);
    if (!exists) return;

    // Optimistic update
    setNotifications(prev =>
      prev.filter(n => n.userNotificationId !== id)
    );
    if (!exists.isRead) setUnreadCount(prev => Math.max(prev - 1, 0));

    try {
      await NotificationService.deleteNotification(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
      // Rollback if delete fails
      setNotifications(prev => [exists, ...prev]);
      if (!exists.isRead) setUnreadCount(prev => prev + 1);
    }
  };

  const markAllRead = () => {
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
        toggleNotificationRead,
        deleteNotification,
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
