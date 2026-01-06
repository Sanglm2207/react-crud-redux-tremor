import { createSlice } from "@reduxjs/toolkit";
import { PermissionState } from "./types";
import { fetchPermissions, createPermission, updatePermission, deletePermission } from "./actions";

const initialState: PermissionState = {
  list: [],
  meta: {
    page: 1,
    pageSize: 10,
    pages: 0,
    total: 0
  },
  isLoading: false,
  error: null,
};

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPermissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.result;
        state.meta = action.payload.meta; // Lưu meta phân trang
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createPermission.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.isLoading = false;
      })
      // Update
      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        state.meta.total -= 1; // Giảm tổng số lượng ảo
      })
  },
});

export default permissionsSlice.reducer;