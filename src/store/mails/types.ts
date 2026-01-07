import { Meta } from "../users";

export type MailStatus = "SENT" | "SCHEDULED" | "FAILED" | "PENDING";

export interface Mail {
  id: number;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  status: MailStatus;
  scheduledAt?: string;
  sentAt?: string;
}

export interface MailsState {
  list: Mail[];
  meta: Meta;
  isLoading: boolean;
  error: string | null;
}

export interface SendMailDto {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  scheduledAt?: string | null; // ISO Date string
}

export interface FetchMailsParams {
  page?: number;
  pageSize?: number;
  to?: string; // Search by receiver
  status?: string;
}