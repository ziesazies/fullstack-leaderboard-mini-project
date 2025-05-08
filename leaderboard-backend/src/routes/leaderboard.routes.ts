const router = require("express").Router();
const controller = require("../controller/leaderboard.controller.js");

router.get("/leaderboards/:code", controller.getLeaderboards);

export default router;
