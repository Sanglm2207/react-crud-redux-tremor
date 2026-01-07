import { createSlice } from "@reduxjs/toolkit";
import { IssuesState } from "./types";
import { fetchIssues, createIssue, acceptIssue, completeFix, completeDelivery } from "./actions";

const initialState: IssuesState = {
  list: [],
  meta: { page: 1, pageSize: 10, pages: 0, total: 0 },
  isLoading: false,
  error: null,
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchIssues.pending, (state) => { state.isLoading = true; })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.result;
        state.meta = action.payload.meta;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create (Load lại sau khi tạo để đúng thứ tự)
      .addCase(createIssue.fulfilled, (state) => {
        state.isLoading = false;
      })

      // Workflow Actions: Update state local ngay lập tức
      .addCase(acceptIssue.fulfilled, (state, action) => {
        const index = state.list.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(completeFix.fulfilled, (state, action) => {
        const index = state.list.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(completeDelivery.fulfilled, (state, action) => {
        const index = state.list.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default issuesSlice.reducer;