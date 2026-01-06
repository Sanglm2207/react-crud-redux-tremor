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
  active?: boolean;
  createdAt?: string;
}

export interface UsersState {
  list: User[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password?: string;
  roleId: number;
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