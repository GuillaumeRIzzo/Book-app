import { RootState } from "@/redux/store";

export const selectAllLanguages = (state: RootState) => state.languages.languages;
export const selectLanguageStatus = (state: RootState) => state.languages.status;
export const selectLanguageError = (state: RootState) => state.languages.error;