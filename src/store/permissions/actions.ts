import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { CreatePermissionDto, Permission, UpdatePermissionDto } from "./types";
import { ApiResponse } from "../auth/types"; // Tái sử dụng type ApiResponse chung

export const fetchPermissions = createAsyncThunk<Permission[]>(
  "permissions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ result: Permission[] }>>("/permissions");
      return res.data.data.result;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createPermission = createAsyncThunk<Permission, CreatePermissionDto>(
  "permissions/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Permission>>("/permissions", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updatePermission = createAsyncThunk<Permission, UpdatePermissionDto>(
  "permissions/update",
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...body } = data;
      const res = await api.patch<ApiResponse<Permission>>(`/permissions/${id}`, body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deletePermission = createAsyncThunk<number, number>(
  "permissions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/permissions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);