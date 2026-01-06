import { Meta } from "../users";

export interface Permission {
  id: number;
  name: string;
  apiPath: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  module: string; // Ví dụ: "USER", "AUTH", "ROLE"
}

export interface PermissionState {
  list: Permission[];
  meta: Meta;
  isLoading: boolean;
  error: string | null;
}

// Params gửi lên API
export interface FetchPermissionsParams {
  page?: number;
  pageSize?: number;
  name?: string;     // Search theo tên
  module?: string;   // Search theo module
  apiPath?: string;  // Search theo apiPath
}


export interface CreatePermissionDto {
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

export interface UpdatePermissionDto extends CreatePermissionDto {
  id: number;
}