/*React-based Libraries */
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    logout: false,
    token: "",
    permissions: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLogout: (state, action) => {
      state.logout = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

export const { setUser, setLoading, setLogout, setToken, setPermissions } =
  userSlice.actions;

export default userSlice.reducer;
