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

      .addCase(acceptIssue.fulfilled, (state, action) => {
        const updatedIssue = action.payload;
        // Tìm và cập nhật
        const index = state.list.findIndex(i => i.id === updatedIssue.id);
        
        if (index !== -1) {
            state.list[index] = {
                ...state.list[index],
                status: "PROCESSING", // Cập nhật trạng thái
                assigneeEmail: updatedIssue.assigneeEmail // Cập nhật người làm (lấy từ action trên)
            };
        }
    })

      // 2. COMPLETE FIX
      .addCase(completeFix.fulfilled, (state, action) => {
        const { id, needDelivery } = action.meta.arg;

        const index = state.list.findIndex(i => String(i.id) === String(id));
        if (index !== -1) {
          state.list[index].status = needDelivery ? "DELIVERING" : "DONE";

          if (action.payload) {
            state.list[index] = { ...state.list[index], ...action.payload };
          }
        }
      })

      .addCase(completeDelivery.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        const index = state.list.findIndex(i => String(i.id) === String(id));

        if (index !== -1) {
          state.list[index].status = "DELIVERED";
          if (action.payload) {
            state.list[index] = { ...state.list[index], ...action.payload };
          }
        }
      });
  },
});

export default issuesSlice.reducer;