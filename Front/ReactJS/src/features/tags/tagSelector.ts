import { RootState } from "@/redux/store";

export const selectAllTags = (state: RootState) => state.tags.tags;
export const selectTagStatus = (state: RootState) => state.tags.status;
export const selectTagError = (state: RootState) => state.tags.error;