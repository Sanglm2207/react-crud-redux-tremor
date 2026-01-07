import { createSlice } from "@reduxjs/toolkit";
import { GamificationState } from "./types";
import { fetchLeaderboard } from "./actions";

const initialState: GamificationState = {
    leaderboard: [],
    isLoading: false,
    error: null,
};

export const gamificationSlice = createSlice({
    name: "gamification",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboard.pending, (state) => { state.isLoading = true; })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.leaderboard = action.payload;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default gamificationSlice.reducer;