import { Permission } from "../permissions/types";

export interface Role {
  id: number;
  name: string;
  description: string;
  active: boolean;
  permissions: Permission[]; // Backend trả về danh sách permission chi tiết
}

export interface RoleState {
  list: Role[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  active: boolean;
  permissions: number[]; 
}

export interface UpdateRoleDto extends CreateRoleDto {
  id: number;
}