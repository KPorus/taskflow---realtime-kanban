import { createSlice } from "@reduxjs/toolkit";
import { DataState } from "../../types";
import { applyTeamUpdated,setActiveTeam, applyDeleteTeam } from "./helper/teamReducers";
import { socketReducers } from "./helper/socketReducers";
import {
  addTeamMember,
  createTask,
  createTeam,
  deleteTask,
  deleteTeam,
  fetchAllUsers,
  fetchTasks,
  fetchTeams,
  removeTeamMember,
  updateTask,
} from "./helper/dataThunks";
import {
  applySocketTaskCreated,
  applyTaskDeleted,
  applyTaskUpdated,
} from "./helper/taskReducers";

const initialState: DataState = {
  teams: [],
  tasks: [],
  users: [],
  activeTeamId: null,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setActiveTeam,
    ...socketReducers,
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
        // applyCreateTeam(state,action)
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        applyDeleteTeam(state, action)
        // console.log(action.payload);
        // state.teams = state.teams.filter((t) => t.id !== action.payload);
        // if (state.activeTeamId === action.payload) {
        //   state.activeTeamId =
        //     state.teams.length > 0 ? state.teams[0].id : null;
        // }
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        applyTeamUpdated(state, action);
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        console.log(state,action);
        applyTeamUpdated(state, action);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading=false;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        applySocketTaskCreated(state, action);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        applyTaskUpdated(state, action);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        applyTaskDeleted(state, action);
      });
  },
});

export const {
  setActiveTeam: setActiveTeamAction,
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
  socketTeamUpdated,
  socketTeamDelete
  // socketTeamCreated,
} = dataSlice.actions;

export default dataSlice.reducer;
