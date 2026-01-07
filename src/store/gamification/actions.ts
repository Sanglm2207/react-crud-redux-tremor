import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { getErrorMessage } from "../../utils/api-error";
import { LeaderboardUser } from "./types";
import { ApiResponse } from "../auth/types";

export const fetchLeaderboard = createAsyncThunk<LeaderboardUser[]>(
    "gamification/leaderboard",
    async (_, { rejectWithValue }) => {
        try {
            // API trả về List
            const res = await api.get<ApiResponse<LeaderboardUser[]>>("/gamification/leaderboard");
            return res.data.data; 
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);