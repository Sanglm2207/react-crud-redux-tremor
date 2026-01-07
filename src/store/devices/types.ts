import { Meta } from "../users";

export interface Device {
  id: number;
  code: string;
  name: string;
  type: string; // Laptop, PC, Printer...
  status: string; // ACTIVE, BROKEN, MAINTENANCE
  department: string;
  description?: string;
  updatedAt?: string;
}

export interface DevicesState {
  list: Device[];
  meta: Meta;
  isLoading: boolean;
  error: string | null;
}

export interface CreateDeviceDto {
  code: string;
  name: string;
  type: string;
  status: string;
  department: string;
  description?: string;
}

export interface UpdateDeviceDto {
  id: number;
  code?: string;
  name?: string;
  type?: string;
  status?: string;
  department?: string;
  description?: string;
}

export interface FetchDevicesParams {
  page?: number;
  pageSize?: number;
  name?: string; // Search
  type?: string;
  status?: string;
}