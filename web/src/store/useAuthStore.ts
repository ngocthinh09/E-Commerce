import { create } from "zustand";
import axiosClient from "../api/axiosClient";
import { type LoginData } from "../pages/auth/LoginPage";
import type { SignupData } from "../pages/auth/SignupPage";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (loginData: LoginData) => Promise<void>;
  signup: (signupData: SignupData) => Promise<string>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (loginData) => {
    console.log("Attempting login with:", loginData);
    set({ isLoading: true });
    try {
      console.log("Sending login request to backend...");
      const response = await axiosClient.post("/api/auth/login", loginData);
      console.log("Login response:", response.data);
      const { user } = response.data;
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (signupData: SignupData) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.post("/api/auth/signup", signupData);
      set({ isLoading: false });
      return response.data.message;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosClient.post("/api/auth/signout");
      set({ user: null, isAuthenticated: false });
      toast.success("Logged out successfully");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  },

  fetchProfile: async () => {
    try {
      const response = await axiosClient.get("/api/auth/profile");
      set({ user: response.data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));