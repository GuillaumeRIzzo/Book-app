import { RootState } from "@/redux/store";

export const selectAllPreferences = (state: RootState) => state.preferences.preferences;
export const selectPreferenceStatus = (state: RootState) => state.preferences.status;
export const selectPreferenceError = (state: RootState) => state.preferences.error;