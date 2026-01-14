import { DataState, Task, Team } from "../../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  applySocketTaskCreated,
  applyTaskUpdated,
  applyTaskDeleted,
} from "./taskReducers";
import { applyTeamUpdated } from "./teamReducers";

export const socketReducers = {
  socketTaskCreated: applySocketTaskCreated,
  socketTaskUpdated: applyTaskUpdated,
  socketTaskDeleted: applyTaskDeleted,
  socketTeamUpdated: applyTeamUpdated as (
    state: DataState,
    action: PayloadAction<Team>
  ) => void,
};
