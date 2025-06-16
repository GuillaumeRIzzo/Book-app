import { RootState } from "@/redux/store";

export const selectAllThemes = (state: RootState) => state.themes.themes;
export const selectThemeStatus = (state: RootState) => state.themes.status;
export const selectThemeError = (state: RootState) => state.themes.error;