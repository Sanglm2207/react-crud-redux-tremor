export interface Permission {
  id: number;
  name: string;
  apiPath: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  module: string; // Ví dụ: "USER", "AUTH", "ROLE"
}

export interface PermissionState {
  list: Permission[];
  isLoading: boolean;
  error: string | null;
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