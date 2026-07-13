import { RootState } from "@/redux/store";

export const selectAllBookImages = (state: RootState) => state.bookImages.bookImages;
export const selectBookImageStatus = (state: RootState) => state.bookImages.status;
export const selectBookImageError = (state: RootState) => state.bookImages.error;