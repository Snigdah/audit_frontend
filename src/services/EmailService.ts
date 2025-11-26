import apiClient from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { ApiResponse } from "../types/api";
import type { MailConfigRequest, MailConfigResponse } from "../types/email";

class EmailService {
  // Configure email settings
  async configureMail(config: MailConfigRequest): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(
      ENDPOINTS.EMAIL.CONFIGURE_EMAIL,
      config
    );
    return response.data.data;
  }

  // Get email configuration
  async getMailConfig(): Promise<MailConfigResponse> {
    const response = await apiClient.get<ApiResponse<MailConfigResponse>>(
      ENDPOINTS.EMAIL.GET_EMAIL_CONFIG
    );
    return response.data.data;
  }

  // Test email connection
  async testMailConnection(): Promise<void> {
    const response = await apiClient.get<ApiResponse<void>>(
      ENDPOINTS.EMAIL.TEST_EMAIL
    );
    return response.data.data;
  }
}

export default new EmailService();