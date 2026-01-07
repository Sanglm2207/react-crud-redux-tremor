import { createSlice } from "@reduxjs/toolkit";
import { FilesState } from "./types";
import { fetchFiles, deleteFile, uploadFile } from "./actions";

const initialState: FilesState = {
  list: [],
  isLoading: false,
  error: null,
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f.id !== action.payload);
      })
      // UPLOAD FILE
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Thêm file mới lên đầu danh sách
        state.list.unshift(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default filesSlice.reducer;