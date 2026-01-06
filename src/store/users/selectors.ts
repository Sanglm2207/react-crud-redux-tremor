import { RootState } from "../index";

export const selectUsers = (state: RootState) => state.users;

export const selectUsersLoading = (state: RootState) => state.users.isLoading;