import { createSlice } from "@reduxjs/toolkit";
import { DevicesState } from "./types";
import { fetchDevices, createDevice, deleteDevice, updateDevice } from "./actions";

const initialState: DevicesState = {
  list: [],
  meta: { page: 1, pageSize: 10, pages: 0, total: 0 },
  isLoading: false,
  error: null,
};

export const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.result;
        state.meta = action.payload.meta;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createDevice.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.list.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.list = state.list.filter(d => d.id !== action.payload);
        state.meta.total -= 1;
      });
  },
});

export default devicesSlice.reducer;