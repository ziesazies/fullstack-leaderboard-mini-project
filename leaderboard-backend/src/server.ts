import express from "express";
import sequelize from "./config/database.js";
import app from "./app.js";
// const app = express();
app.use(express.json());

sequelize.sync({ force: true }).then(() => {
  console.log("Database synced");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
