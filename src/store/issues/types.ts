import { Meta } from "../users/types"; // Tái sử dụng Meta

export type IssueStatus = "PENDING" | "PROCESSING" | "DONE" | "DELIVERING" | "DELIVERED" | "CLOSED";

export interface Issue {
  id: number;
  reporterName?: string; // Tên người báo (nếu backend trả về string)
  reporter?: {           // Hoặc object user (tùy backend map)
      id: number;
      name: string;
      email: string;
  };
  department: string;
  deviceName: string;
  errorType: string;
  description: string;
  imageUrl?: string;
  status: IssueStatus;
  
  // Thông tin xử lý
  assignee?: {
      id: number;
      name: string;
  };
  fixNote?: string;
  deliveryImage?: string;
  
  createdAt?: string;
  resolvedAt?: string;
}

export interface IssuesState {
  list: Issue[];
  meta: Meta;
  isLoading: boolean;
  error: string | null;
}

export interface CreateIssueDto {
  deviceName: string;
  errorType: string;
  description: string;
  imageUrl?: string;
  // Các field khác tuỳ backend yêu cầu (reporterName, department...)
  reporterName?: string;
  department?: string;
}

// Params cho API Complete Fix
export interface CompleteFixDto {
  id: number;
  note: string;
  needDelivery: boolean;
}

// Params cho API Complete Delivery
export interface CompleteDeliveryDto {
  id: number;
  imageUrl: string;
}

export interface FetchIssuesParams {
  page?: number;
  pageSize?: number;
  status?: string;
}