import { createSlice } from "@reduxjs/toolkit";
import { PermissionState } from "./types";
import { fetchPermissions, createPermission, updatePermission, deletePermission } from "./actions";

const initialState: PermissionState = {
  list: [],
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
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      // Create
      .addCase(createPermission.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export default permissionsSlice.reducer;