import { RootState } from "@/redux/store";

export const selectAllUserRights = (state: RootState) => state.userRights.userRights;
export const selectUserRightStatus = (state: RootState) => state.userRights.status;
export const selectUserRightError = (state: RootState) => state.userRights.error;