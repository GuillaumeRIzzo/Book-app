import { RootState } from "@/redux/store";

export const selectAllColors = (state: RootState) => state.colors.colors;
export const selectColorStatus = (state: RootState) => state.colors.status;
export const selectColorError = (state: RootState) => state.colors.error;