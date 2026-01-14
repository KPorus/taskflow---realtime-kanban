import { User } from "@/types";

const USER_KEY = "taskflow_user";
const TOKEN_KEY = "taskflow_token";

export const loadAuthFromStorage = () => {
  const userRaw = localStorage.getItem(USER_KEY);
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    user: userRaw ? (JSON.parse(userRaw) as User) : null,
    token,
    isAuthenticated: !!token,
  };
};

export const persistAuthToStorage = (user: User, token: string) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthFromStorage = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
