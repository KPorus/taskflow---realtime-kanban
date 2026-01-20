import { PayloadAction } from "@reduxjs/toolkit";
import { DataState, Team } from "../../../types";

export const setActiveTeam = (
  state: DataState,
  action: PayloadAction<string>
) => {
  state.activeTeamId = action.payload;
  state.tasks = [];
};
// export const applyCreateTeam=(state:DataState,action:PayloadAction<Team>)=>{
//     state.teams.push(action.payload);
//     state.activeTeamId = action.payload.id;
// }
export const applyTeamUpdated = (
  state: DataState,
  action: PayloadAction<Team>
) => {
  const index = state.teams.findIndex((t) => t.id === action.payload.id);
  if (index !== -1) {
    state.teams[index] = action.payload;
  } else {
    state.teams.push(action.payload);
  }
};
export const applyDeleteTeam = (
  state: DataState,
  action: PayloadAction<string>
) => {
  state.teams = state.teams.filter((t) => t.id !== action.payload);
  if (state.activeTeamId == action.payload) {
    state.activeTeamId = state.teams.length > 0 ? state.teams[0].id : null;
  }
};
