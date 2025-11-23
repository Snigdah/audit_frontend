export interface NotificationDTO {
  notificationId: number;
  type: string;
  title: string;
  message: string;
  redirectUrl: string;
  metadata: Record<string, any> | null;
  isRead: boolean;
  createdAt: string | null;
  cursor: string | null; 
}

export interface NotificationResponse {
  notifications: NotificationDTO[];
  employeeId: string;
  unreadCount: number;
  nextCursor: string | null;
  hasMore: boolean;
}
