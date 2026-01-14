import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { ApiService } from '../../services/apiService';

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('taskflow_user') || 'null'),
  token: localStorage.getItem('taskflow_token'),
  isAuthenticated: !!localStorage.getItem('taskflow_token'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password?: string }) => {
    return await ApiService.auth.login(email, password);
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: { name: string; email: string; password?: string }) => {
    return await ApiService.auth.register(name, email, password);
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('taskflow_token');
    const userData = localStorage.getItem('taskflow_user');
    
    if (!token || !userData) {
      throw new Error('No session found');
    }
    
    // We trust the local data for now as instructed to remove 'me'
    return JSON.parse(userData);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;