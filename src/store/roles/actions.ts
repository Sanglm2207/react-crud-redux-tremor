import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { CreateRoleDto, Role, UpdateRoleDto } from "./types";
import { ApiResponse } from "../auth/types";

export const fetchRoles = createAsyncThunk<Role[]>(
  "roles/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ result: Role[] }>>("/roles");
      return res.data.data.result;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createRole = createAsyncThunk<Role, CreateRoleDto>(
  "roles/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Role>>("/roles", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateRole = createAsyncThunk<Role, UpdateRoleDto>(
  "roles/update",
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...body } = data; 
      const res = await api.patch<ApiResponse<Role>>(`/roles/${id}`, body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteRole = createAsyncThunk<number, number>(
  "roles/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/roles/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);