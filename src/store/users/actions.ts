import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { User, CreateUserDto, UpdateUserDto, Meta, FetchUsersParams } from "./types";
import { ApiResponse } from "../auth/types";

// Response trả về gồm result và meta
interface UsersResponse {
  result: User[];
  meta: Meta;
}

// GET Fetch Users Path
export const fetchUsers = createAsyncThunk<
  UsersResponse, 
  FetchUsersParams
>(
  "users/fetch",
  async (params, { rejectWithValue }) => {
    try {
      // Gọi API kèm query params: /users?page=1&pageSize=10
      const res = await api.get<ApiResponse<{ result: User[], meta: Meta }>>("/users", {
        params: {
          current: params.page || 1,
          pageSize: params.pageSize || 10,
          ...params
        }
      });
      
      // Trả về cả result và meta
      return res.data.data; 
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// POST Create A New User Path
export const createUser = createAsyncThunk<User, CreateUserDto>(
  "users/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<User>>("/users", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// PAT Update User Path (PATCH)
export const updateUser = createAsyncThunk<User, UpdateUserDto>(
  "users/update",
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...body } = data;
      const res = await api.patch(`/users/${id}`, body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// DEL Delete User Path
export const deleteUser = createAsyncThunk<number, number>(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  // Gọi api /files/upload
  const res = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  // Trả về fileUrl từ response
  return res.data.data.fileUrl; 
};