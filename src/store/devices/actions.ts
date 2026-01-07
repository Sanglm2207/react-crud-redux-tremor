import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { Device, CreateDeviceDto, FetchDevicesParams, UpdateDeviceDto } from "./types";
import { ApiResponse } from "../auth/types";
import { Meta } from "../users";

export const fetchDevices = createAsyncThunk<{ result: Device[], meta: Meta }, FetchDevicesParams>(
  "devices/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ result: Device[], meta: Meta }>>("/devices", {
        params: {
          current: params.page || 1,
          pageSize: params.pageSize || 10,
          ...params
        }
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createDevice = createAsyncThunk<Device, CreateDeviceDto>(
  "devices/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Device>>("/devices", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// PUT/PATCH Update Device
export const updateDevice = createAsyncThunk<Device, UpdateDeviceDto>(
  "devices/update",
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...body } = data;
      const res = await api.patch<ApiResponse<Device>>(`/devices/${id}`, body);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// DEL Delete Device
export const deleteDevice = createAsyncThunk<number, number>(
  "devices/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/devices/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);