import express from "express";
import cors from "cors";
import router from "./routes/leaderboard.routes";

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default development server port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/api", router);

// ...

export default app;
