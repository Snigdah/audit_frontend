import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { NotificationResponse } from "../types/notification";

class NotificationService{

  async getAllNotifications(cursor?: string | null, size: number = 20): Promise<NotificationResponse> {
    const response = await apiClient.get<ApiResponse<NotificationResponse>>(
      ENDPOINTS.NOTIFICATION.FETCH_ALL,
      {
        params: {
          cursor: cursor ?? null,
          size: size,
        },
      }
    );

    return response.data.data;
  }

  // for change status
  async updateNotification(id: number): Promise<void> {
    if (!id) throw new Error("Notification ID is required");
    await apiClient.put<ApiResponse<void>>(ENDPOINTS.NOTIFICATION.UPDATE(id));
  }

  // DELETE Notification
  async deleteNotification(id: number): Promise<void> {
    if (!id) throw new Error("Notification ID is required");
    await apiClient.delete<ApiResponse<void>>(ENDPOINTS.NOTIFICATION.DELETE(id));
  }

}

export default new NotificationService();