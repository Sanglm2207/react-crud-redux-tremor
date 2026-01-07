import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { FileData } from "./types";
import { ApiResponse } from "../auth/types";

// GET Fetch all files
export const fetchFiles = createAsyncThunk<FileData[]>(
  "files/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<FileData[]>>("/files");
      return res.data.data; // API trả về mảng data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// DEL Delete file
export const deleteFile = createAsyncThunk<number, number>(
  "files/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/files/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// POST Upload File (Hỗ trợ mọi định dạng)
export const uploadFile = createAsyncThunk<FileData, File>(
  "files/upload",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post<ApiResponse<FileData>>("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data; // Trả về thông tin file đã lưu (URL, ID...)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);