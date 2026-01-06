import { Role } from "../roles";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: number;
  email: string;
  name: string;
  age?: number;
  gender?: Gender;
  address?: string;
  phone?: string;
  avatar?: string;
  role?: Role; 
  is_active?: boolean;
  createdAt?: string;
}

export interface UsersState {
  list: User[];
  meta: Meta;
  isLoading: boolean;
  error: string | null;
}

export interface Meta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface FetchUsersParams {
  page?: number;
  pageSize?: number;
  // Có thể thêm search, sort sau này
  name?: string;   // Để search theo tên
  email?: string;  // Để search theo email (nếu cần)
  is_active?: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  age?: number;
  gender?: Gender;
  address?: string;
  phone?: string;
  role?: { id: number }; 
  avatar?: string;
}

export interface UpdateUserDto {
  id: number;
  name?: string;
  age?: number;
  gender?: Gender;
  address?: string;
  phone?: string;
  avatar?: string;
  role?: { id: number }; 
}