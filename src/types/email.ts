// Request DTOs
export interface MailConfigRequest {
  senderMail: string;
  userName: string;
  appPassword: string; 
  host: string;
  port: number;
  encryption: 'SSL' | 'TLS' | 'NONE';
  receiverMail: string;
}

// Response DTOs
export interface MailConfigResponse {
  senderMail: string;
  userName: string;
  appPassword: string;
  host: string;
  port: number;
  encryption: string;
  receiverMail: string;
}