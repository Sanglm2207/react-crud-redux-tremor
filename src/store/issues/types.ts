import { Meta } from "../users";

export type IssueStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Issue {
  id: number;
  reporterName: string;
  department: string;
  deviceName: string;
  errorType: string;
  description: string;
  imageUrl?: string;
  status: IssueStatus;
  reportedAt?: string; // hoặc createdAt
  resolvedAt?: string;
}

export interface IssuesState {
  list: Issue[];
  meta: Meta;
  isLoading: boolean;
  error: string | null;
}

export interface CreateIssueDto {
  reporterName: string;
  department: string;
  deviceName: string;
  errorType: string;
  description: string;
  imageUrl?: string;
  status?: IssueStatus; // Optional, mặc định là PENDING
}

export interface FetchIssuesParams {
  page?: number;
  pageSize?: number;
  status?: string;
  reporterName?: string; // Search theo tên người báo
}