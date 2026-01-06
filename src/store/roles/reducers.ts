import { createSlice } from "@reduxjs/toolkit";
import { RoleState } from "./types";
import { fetchRoles, createRole, updateRole, deleteRole } from "./actions";

const initialState: RoleState = {
  list: [],
  isLoading: false,
  error: null,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      // CREATE
      .addCase(createRole.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // UPDATE: Đây là phần quan trọng để UI tự thay đổi mà không cần F5
      .addCase(updateRole.fulfilled, (state, action) => {
        const updatedRole = action.payload;
        // Tìm index dựa trên ID (đảm bảo cả 2 cùng kiểu dữ liệu, nếu không chắc thì ép String)
        const index = state.list.findIndex((r) => String(r.id) === String(updatedRole.id));
        
        if (index !== -1) {
          state.list[index] = updatedRole; // Gán đè role mới vào vị trí cũ
        }
      })
      // DELETE
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
      });
  },
});

export default rolesSlice.reducer;