import { RootState } from "@/redux/store";

export const selectAllCategories = (state: RootState) => state.categories.categories;
export const selectCategoriesStatus = (state: RootState) => state.categories.status;
export const selectCategoriesError = (state: RootState) => state.categories.error;