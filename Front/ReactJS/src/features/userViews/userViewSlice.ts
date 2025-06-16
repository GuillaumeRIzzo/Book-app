import { createSlice } from '@reduxjs/toolkit';

import { userModelViewState } from '@/models/userViews/UserModelViewState';

const initialState: userModelViewState = {
  userViews: [],
  status: 'idle',
  error: null,
};

const userViewSlice = createSlice({
  name: 'userViews',
  initialState,
  reducers: {
    setUserViews(state, action) {
      state.userViews = action.payload;
    },
  },
});

export const { setUserViews } = userViewSlice.actions;

export default userViewSlice.reducer;
