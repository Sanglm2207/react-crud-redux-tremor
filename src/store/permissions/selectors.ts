import { RootState } from "../index";

export const selectPermissions = (state: RootState) => state.permissions.list;
