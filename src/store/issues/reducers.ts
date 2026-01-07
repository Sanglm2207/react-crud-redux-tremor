import { createSlice } from "@reduxjs/toolkit";
import { IssuesState } from "./types";
import { fetchIssues, createIssue } from "./actions";

const initialState: IssuesState = {
  list: [],
  meta: { page: 1, pageSize: 10, pages: 0, total: 0 },
  isLoading: false,
  error: null,
};

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchIssues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.result;
        state.meta = action.payload.meta;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createIssue.fulfilled, (state) => {
        state.isLoading = false;
        // Không push vào list để tránh lệch data với server side pagination
        // UI sẽ tự gọi fetch lại
      });
  },
});

export default issuesSlice.reducer;