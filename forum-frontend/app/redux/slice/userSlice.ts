// app/redux/slice/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  profile: Profile | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    logout: (state) => {
      state.profile = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
