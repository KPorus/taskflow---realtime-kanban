import { PayloadAction } from "@reduxjs/toolkit";
import { DataState, Team } from "../../../types";

export const setActiveTeam = (
  state: DataState,
  action: PayloadAction<string>
) => {
  state.activeTeamId = action.payload;
};

export const applyTeamUpdated = (
  state: DataState,
  action: PayloadAction<Team>
) => {
  const index = state.teams.findIndex((t) => t.id === action.payload.id);
  if (index !== -1) {
    state.teams[index] = action.payload;
  }
};
