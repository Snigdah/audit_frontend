import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { NotificationResponse } from "../types/notification";

class NotificationService{

    async getAllNotifications(): Promise<NotificationResponse> {
        const response = await apiClient.get<ApiResponse<NotificationResponse>>(
         ENDPOINTS.NOTIFICATION.FETCH_ALL
        );
    return response.data.data;
  }
}

export default new NotificationService();