import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { Issue, CreateIssueDto, FetchIssuesParams, CompleteFixDto, CompleteDeliveryDto } from "./types";
import { ApiResponse } from "../auth/types";
import { Meta } from "../users";
import { RootState } from "..";

// 1. GET Fetch Issues
export const fetchIssues = createAsyncThunk<{ result: Issue[], meta: Meta }, FetchIssuesParams>(
  "issues/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ result: Issue[], meta: Meta }>>("/issues", {
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

// 2. POST Create Issue
export const createIssue = createAsyncThunk<Issue, CreateIssueDto>(
  "issues/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Issue>>("/issues", data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 3. POST Accept Issue (Nhận việc)
export const acceptIssue = createAsyncThunk<Issue, number>(
  "issues/accept",
  async (id, { rejectWithValue, getState }) => {
    try {
      // 1. Gọi API (Chỉ gửi ID)
      const res = await api.post<ApiResponse<Issue>>(`/issues/${id}/accept`);
      
      // 2. Lấy thông tin User hiện tại từ Redux Store để "vá" dữ liệu
      const state = getState() as RootState;
      const currentUserEmail = state.auth.user?.email;

      // 3. Trả về dữ liệu từ API, nhưng ép thêm assigneeEmail của người đang login
      // Điều này giúp UI cập nhật ngay lập tức mà không cần API phải trả về field này
      return {
        ...res.data.data,
        assigneeEmail: currentUserEmail || res.data.data.assigneeEmail
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


// 4. POST Complete Fix (Hoàn thành sửa)
// API: /api/v1/issues/{id}/complete-fix?note=...&needDelivery=...
export const completeFix = createAsyncThunk<Issue, CompleteFixDto>(
  "issues/completeFix",
  async ({ id, note, needDelivery }, { rejectWithValue }) => {
    try {
      // Backend yêu cầu params, không phải body
      const res = await api.post(`/issues/${id}/complete-fix`, null, {
        params: { note, needDelivery }
      });
      return res.data.data;
    } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
  }
);

// 5. POST Complete Delivery (Xác nhận giao hàng)
// API: /api/v1/issues/{id}/complete-delivery?imageUrl=...
export const completeDelivery = createAsyncThunk<Issue, CompleteDeliveryDto>(
  "issues/completeDelivery",
  async ({ id, imageUrl }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/issues/${id}/complete-delivery`, null, {
        params: { imageUrl }
      });
      return res.data.data;
    } catch (error: any) { return rejectWithValue(error.response?.data?.message); }
  }
);