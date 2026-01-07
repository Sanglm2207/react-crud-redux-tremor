import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { Mail, SendMailDto, FetchMailsParams } from "./types";
import { ApiResponse } from "../auth/types";
import { Meta } from "../users";

// GET Fetch Mails
export const fetchMails = createAsyncThunk<{ result: Mail[], meta: Meta }, FetchMailsParams>(
  "mails/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ result: Mail[], meta: Meta }>>("/mails", {
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

// POST Send Mail
export const sendMail = createAsyncThunk<Mail, SendMailDto>(
  "mails/send",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Mail>>("/mails", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// PUT Update Mail (Dùng để reschedule hoặc sửa nội dung khi chưa gửi)
export const updateMail = createAsyncThunk<Mail, { id: number; data: SendMailDto }>(
  "mails/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<Mail>>(`/mails/${id}`, data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// DEL Delete Mail
export const deleteMail = createAsyncThunk<number, number>(
  "mails/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/mails/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);