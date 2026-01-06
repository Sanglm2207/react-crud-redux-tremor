import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { LoginPayload, ApiResponse } from "./types";
import { getErrorMessage } from "../../utils/api-error";
import { toast } from "sonner";

// Định nghĩa LoginCredentials nếu chưa có trong types.ts
// export interface LoginCredentials { email: string; password: string; }

export const loginUser = createAsyncThunk<
  LoginPayload,          // Return type (fulfilled)
  { email: string; password: string }, // Argument type
  { rejectValue: string } // Config type cho reject
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    // Gọi API, ép kiểu response data trả về
    const response = await api.post<ApiResponse<LoginPayload>>("/auth/login", credentials);
    return response.data.data;
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const refreshAccessToken = createAsyncThunk<
  string, // Return type: token mới
  void,   // Argument: không có
  { rejectValue: string }
>("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    // Giả sử API trả về { data: { access_token: "..." } }
    const response = await api.get<ApiResponse<{ access_token: string }>>("/auth/refresh");
    return response.data.data.access_token;
  } catch (error: unknown) {
    // Không cần toast lỗi ở đây vì interceptor sẽ xử lý logout sau đó
    return rejectWithValue(getErrorMessage(error));
  }
});