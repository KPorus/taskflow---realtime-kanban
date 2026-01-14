import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DataState, Team, Task } from '../../types';
import { ApiService } from '../../services/apiService';

const initialState: DataState = {
  teams: [],
  tasks: [],
  users: [],
  activeTeamId: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTeams = createAsyncThunk(
  'data/fetchTeams',
  async () => {
    return await ApiService.teams.list();
  }
);

export const createTeam = createAsyncThunk(
  'data/createTeam',
  async ({ name }: { name: string }) => {
    return await ApiService.teams.create(name);
  }
);

export const deleteTeam = createAsyncThunk(
  'data/deleteTeam',
  async (teamId: string) => {
    return await ApiService.teams.delete(teamId);
  }
);

export const addTeamMember = createAsyncThunk(
  'data/addMember',
  async ({ teamId, userId }: { teamId: string; userId: string }) => {
    return await ApiService.teams.addMember(teamId, userId);
  }
);

export const removeTeamMember = createAsyncThunk(
  'data/removeMember',
  async ({ teamId, userId }: { teamId: string; userId: string }) => {
    return await ApiService.teams.removeMember(teamId, userId);
  }
);

export const fetchTasks = createAsyncThunk(
  'data/fetchTasks',
  async (teamId: string) => {
    return await ApiService.tasks.list(teamId);
  }
);

export const fetchAllUsers = createAsyncThunk(
    'data/fetchAllUsers',
    async () => {
        return await ApiService.users.list();
    }
);

export const createTask = createAsyncThunk(
  'data/createTask',
  async (task: Omit<Task, 'id' | 'createdAt'>) => {
    return await ApiService.tasks.create(task);
  }
);

export const updateTask = createAsyncThunk(
  'data/updateTask',
  async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
    return await ApiService.tasks.update(taskId, updates);
  }
);

export const deleteTask = createAsyncThunk(
  'data/deleteTask',
  async ({ taskId, teamId }: { taskId: string; teamId: string }) => {
    await ApiService.tasks.delete(taskId, teamId);
    return taskId;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setActiveTeam: (state, action: PayloadAction<string>) => {
      state.activeTeamId = action.payload;
    },
    // Real-time actions
    socketTaskCreated: (state, action: PayloadAction<Task>) => {
      if (state.activeTeamId === action.payload.teamId) {
        if (!state.tasks.find(t => t.id === action.payload.id)) {
          state.tasks.push(action.payload);
        }
      }
    },
    socketTaskUpdated: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    socketTaskDeleted: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    socketTeamUpdated: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        if (!state.activeTeamId && action.payload.length > 0) {
          state.activeTeamId = action.payload[0].id;
        }
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
        state.activeTeamId = action.payload.id;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(t => t.id !== action.payload);
        if (state.activeTeamId === action.payload) {
          state.activeTeamId = state.teams.length > 0 ? state.teams[0].id : null;
        }
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        const index = state.teams.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        const index = state.teams.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
          state.users = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { setActiveTeam, socketTaskCreated, socketTaskUpdated, socketTaskDeleted, socketTeamUpdated } = dataSlice.actions;
export default dataSlice.reducer;