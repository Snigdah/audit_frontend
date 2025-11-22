export interface NotificationDTO {
  notificationId: number;
  type: string;
  title: string;
  message: string;
  redirectUrl: string;
  metadata: Record<string, any> | null;
  isRead: boolean;
  createdAt: string | null; // LocalDateTime from Java becomes string in JSON
}

export interface NotificationResponse {
  notifications: NotificationDTO[];
  employeeId: string;
  unreadCount: number;
}