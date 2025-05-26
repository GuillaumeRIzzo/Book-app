import { RootState } from "@/redux/store";

export const selectAllImages = (state: RootState) => state.images.images;
export const selectImageStatus = (state: RootState) => state.images.status;
export const selectImageError = (state: RootState) => state.images.error;