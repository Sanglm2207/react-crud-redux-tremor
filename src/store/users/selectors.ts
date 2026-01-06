import { RootState } from "../index";

// Lấy toàn bộ danh sách users
export const selectUsers = (state: RootState) => state.users;

// Ví dụ: Lấy user theo ID (nếu cần)
export const selectUserById = (state: RootState, userId: string) => 
  state.users.find((user) => user.id === userId);