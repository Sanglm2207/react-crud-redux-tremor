import { RootState } from "../index";

export const selectRoles = (state: RootState) => state.roles.list;
