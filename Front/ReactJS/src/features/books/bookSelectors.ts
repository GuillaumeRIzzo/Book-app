import { RootState } from "@/redux/store";

export const selectAllBooks = (state: RootState) => state.books.books;
export const selectBookStatus = (state: RootState) => state.books.status;
export const selectBookError = (state: RootState) => state.books.error;