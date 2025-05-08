import express from "express";
import router from "./routes/leaderboard.routes.js";

const app = express();

app.use(express.json());
app.use("/api", router);

// ...

export default app;
