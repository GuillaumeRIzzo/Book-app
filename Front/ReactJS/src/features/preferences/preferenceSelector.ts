import { RootState } from "@/redux/store";

export const selectPreference = (state: RootState) => state.preferences.preference;
export const selectPreferenceStatus = (state: RootState) => state.preferences.status;
export const selectPreferenceError = (state: RootState) => state.preferences.error;