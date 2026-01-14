import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../../services/apiService";
import { Task } from "../../../types";

export const fetchTeams = createAsyncThunk("data/fetchTeams", async () => {
  return await ApiService.teams.list();
});

export const createTeam = createAsyncThunk(
  "data/createTeam",
  async ({ name }: { name: string }) => {
    return await ApiService.teams.create(name);
  }
);

export const deleteTeam = createAsyncThunk(
  "data/deleteTeam",
  async (teamId: string) => {
    return await ApiService.teams.delete(teamId);
  }
);

export const addTeamMember = createAsyncThunk(
  "data/addMember",
  async ({ teamId, userId }: { teamId: string; userId: string }) => {
    return await ApiService.teams.addMember(teamId, userId);
  }
);

export const removeTeamMember = createAsyncThunk(
  "data/removeMember",
  async ({ teamId, userId }: { teamId: string; userId: string }) => {
    return await ApiService.teams.removeMember(teamId, userId);
  }
);

export const fetchTasks = createAsyncThunk(
  "data/fetchTasks",
  async (teamId: string) => {
    return await ApiService.tasks.list(teamId);
  }
);

export const fetchAllUsers = createAsyncThunk(
  "data/fetchAllUsers",
  async () => {
    return await ApiService.users.list();
  }
);

export const createTask = createAsyncThunk(
  "data/createTask",
  async (task: Omit<Task,  'id' | 'createdAt'>) => {
    return await ApiService.tasks.create(task);
  }
);


export const updateTask = createAsyncThunk(
  "data/updateTask",
  async ({
    taskId,
    updates,
  }: {
    taskId: string;
    updates: Partial<Task>;
  }) => {
    return await ApiService.tasks.update(taskId, updates);
  }
);

export const deleteTask = createAsyncThunk(
  "data/deleteTask",
  async ({ taskId, teamId }: { taskId: string; teamId: string }) => {
    await ApiService.tasks.delete(taskId, teamId);
    return taskId;
  }
);
