import { RootState } from "@/redux/store";

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectUserStatus = (state: RootState) => state.users.status;
export const selectUserError = (state: RootState) => state.users.error;