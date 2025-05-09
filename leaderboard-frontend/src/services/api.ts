import axios from "axios";
import type { LeaderboardResponse } from "../types/leaderboard";

const API_BASE_URL = "http://localhost:3000/api";

export const getLeaderboard = async (
  code: string,
  params?: Record<string, string>
): Promise<LeaderboardResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboards/${code}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};
