import express from "express";
import sequelize from "./config/database";
import app from "./app";
import db from "./models";

// Initialize models and associations first
import "./models/index";

// No need to call express.json() again since it's already in app.ts
// app.use(express.json());

// Start the server
const PORT = process.env.PORT || 3000;

// Sync database without force: true in production
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
