import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("authToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("authToken", action.payload); // save in localStorage
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem("authToken"); 
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
