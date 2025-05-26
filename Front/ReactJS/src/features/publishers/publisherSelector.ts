import { RootState } from "@/redux/store";

export const selectAllPublishers = (state: RootState) => state.publishers.publishers;
export const selectPublisherStatus = (state: RootState) => state.publishers.status;
export const selectPublisherError = (state: RootState) => state.publishers.error;