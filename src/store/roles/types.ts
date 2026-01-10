
export interface Role {
  id: number;
  name: string;
  description: string;
  active: boolean;
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
}

export interface UpdateRoleDto extends CreateRoleDto {
  id: number;
}