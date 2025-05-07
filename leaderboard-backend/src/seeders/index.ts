import sequelize from "../config/database";
import * as groupSeeder from "./01-group.seeder";
import * as userSeeder from "./02-user.seeder";
import * as userGroupSeeder from "./03-user-group.seeder";
import * as tryoutSectionSeeder from "./04-tryout-section.seeder";
import * as examSeeder from "./05-exam.seeder";

const seeders = [
  groupSeeder,
  userSeeder,
  userGroupSeeder,
  tryoutSectionSeeder,
  examSeeder,
];

async function seedAll() {
  await sequelize.sync({ force: true });

  for (const seeder of seeders) {
    await seeder.up();
  }

  console.log("✅ Seeder selesai dijalankan!");
  process.exit();
}

async function rollbackAll() {
  for (const seeder of seeders.reverse()) {
    await seeder.down();
  }

  console.log("🧹 Data di-rollback!");
  process.exit();
}

const args = process.argv.slice(2);
if (args.includes("--down")) {
  rollbackAll();
} else {
  seedAll();
}
