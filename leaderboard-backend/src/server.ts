import express from "express";
import sequelize from "./config/database";
import { User, Group, UserGroup, TryoutSection, Exam } from "./models";

const app = express();
app.use(express.json());

sequelize.sync({ force: true }).then(() => {
  console.log("Database synced");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
