export interface LeaderboardUser {
    id: number;
    email: string;
    fullName: string; // hoặc name
    ccPoints: number;
    avatar?: string;
}

export interface GamificationState {
    leaderboard: LeaderboardUser[];
    isLoading: boolean;
    error: string | null;
}