import { Router, Request, Response } from "express";
import { LeaderboardController } from "../controller/leaderboard.controller";

const router = Router();
const controller = new LeaderboardController();

router.get("/leaderboards/:code", async (req: Request, res: Response) => {
  await controller.getLeaderboards(req, res);
});

export default router;
