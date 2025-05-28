import { RootState } from "@/redux/store";

export const selectAllAuthors = (state: RootState) => state.authors.authors;
export const selectAuthorStatus = (state: RootState) => state.authors.status;
export const selectAuthorError = (state: RootState) => state.authors.error;