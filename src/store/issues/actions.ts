import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { Issue, CreateIssueDto, FetchIssuesParams } from "./types";
import { ApiResponse } from "../auth/types";
import { Meta } from "../users";

// GET Fetch Issues
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

// POST Create Issue
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