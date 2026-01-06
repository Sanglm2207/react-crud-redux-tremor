import { createSlice } from "@reduxjs/toolkit";
import { UsersState } from "./types";
import { fetchUsers, createUser, updateUser, deleteUser } from "./actions";

const initialState: UsersState = {
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

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.result; // Gán danh sách user
        state.meta = action.payload.meta;   // Gán meta phân trang
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // Thêm lên đầu danh sách
        state.isLoading = false;
      })
      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload; // Cập nhật ngay lập tức
        }
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;