export interface Role {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

// Cấu trúc response thành công từ Backend
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  access_token: string;
  refresh_token: string;
  user: User;
}