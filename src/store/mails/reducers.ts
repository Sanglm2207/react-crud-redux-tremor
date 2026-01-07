import { createSlice } from "@reduxjs/toolkit";
import { MailsState } from "./types";
import { deleteMail, fetchMails, sendMail, updateMail } from "./actions";

const initialState: MailsState = {
  list: [],
  meta: { page: 1, pageSize: 10, pages: 0, total: 0 },
  isLoading: false,
  error: null,
};

export const mailsSlice = createSlice({
  name: "mails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMails.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.result;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Mail thành công -> Thêm vào đầu list
      .addCase(sendMail.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.meta.total += 1;
      })
      .addCase(updateMail.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload; // Cập nhật lại mail trong list
        }
      })
      .addCase(deleteMail.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload);
        state.meta.total -= 1;
      });
  },
});

export default mailsSlice.reducer;