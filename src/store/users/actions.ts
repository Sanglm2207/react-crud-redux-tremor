import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { User, CreateUserDto, UpdateUserDto } from "./types";
import { ApiResponse } from "../auth/types";

// GET Fetch Users Path
export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ result: User[] }>>("/users");
      return res.data.data.result || [];
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