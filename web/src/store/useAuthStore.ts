import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { type LoginData } from "../pages/auth/LoginPage";
import type { SignupData } from "../pages/auth/SignupPage";

interface User {
  id: string;
  username: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (loginData: LoginData) => Promise<void>;
  signup: (signupData: SignupData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,

  login: async (loginData) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.post("/api/auth/login", loginData);
      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);

      set({
        token: access_token,
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (signupData: SignupData) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.post("/api/auth/signup", signupData);
      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);

      set({
        token: access_token,
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = "/auth/login";
  },
}));
