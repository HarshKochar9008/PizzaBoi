import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "./types";

const getUserFromLS = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const initialState: AuthState = {
  user: getUserFromLS(),
  isAuthenticated: !!localStorage.getItem("user"),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    register(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { login, register, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer; 