import { DataState, Task, Team } from "../../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  applySocketTaskCreated,
  applyTaskUpdated,
  applyTaskDeleted,
} from "./taskReducers";
import { applyTeamUpdated,applyCreateTeam } from "./teamReducers";

export const socketReducers = {
  socketTaskCreated: applySocketTaskCreated,
  socketTaskUpdated: applyTaskUpdated,
  socketTaskDeleted: applyTaskDeleted,
  socketTeamUpdated: applyTeamUpdated as (
    state: DataState,
    action: PayloadAction<Team>
  ) => void,
  // socketTeamCreated:applyCreateTeam as (state: DataState, action: PayloadAction<Team>)=>void
};
