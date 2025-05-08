import { Request, Response } from "express";
import LeaderboardService from "../services/leaderboard.service.js";

const leaderboardService = new LeaderboardService();

export class LeaderboardController {
  async getLeaderboards(req: Request, res: Response) {
    const code = req.params.code;
    const { groupId, tryoutId } = req.query;

    try {
      const leaderboard = await leaderboardService.getLeaderboard(code, {
        groupId: groupId as string,
        tryoutId: tryoutId as string,
      });

      return res.status(200).json({
        success: true,
        data: leaderboard,
      });
    } catch (error: any) {
      console.error("[GET /leaderboards/:code] Error:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch leaderboard",
      });
    }
  }
}
