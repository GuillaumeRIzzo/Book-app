import { RootState } from "@/redux/store";

export const selectAllGenders = (state: RootState) => state.genders.genders;
export const selectGenderStatus = (state: RootState) => state.genders.status;
export const selectGenderError = (state: RootState) => state.genders.error;