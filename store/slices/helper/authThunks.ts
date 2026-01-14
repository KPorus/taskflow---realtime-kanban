
import { ApiService } from "@/services/apiService";
import { User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password?: string }) => {
    return await ApiService.auth.login(email, password);
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password?: string;
  }) => {
    return await ApiService.auth.register(name, email, password);
  }
);

export const loadUser = createAsyncThunk("auth/loadUser", async () => {
  const token = localStorage.getItem("taskflow_token");
  const userData = localStorage.getItem("taskflow_user");

  if (!token || !userData) {
    throw new Error("No session found");
  }

  return JSON.parse(userData) as User;
});
