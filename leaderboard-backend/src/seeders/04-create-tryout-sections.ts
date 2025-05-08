// src/seeders/04-create-tryout-sections.ts

import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    const now = new Date();
    const startDate = new Date(now);
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30); // Set end date to 30 days from now

    const tryouts = [
      {
        id: "tryout-1",
        code: "TO-FS",
        title: "Tryout Fullstack",
        description: "Fullstack Developer Assessment",
        order: 1,
        data: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: "website",
          duration: 3600000, // 1 hour in milliseconds
        }),
        tag: "fullstack",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tryout-2",
        code: "TO-BE",
        title: "Tryout Backend",
        description: "Backend Developer Assessment",
        order: 2,
        data: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: "accuracy_test",
          duration: 7200000, // 2 hours in milliseconds
        }),
        tag: "backend",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "tryout-3",
        code: "TO-FE",
        title: "Tryout Frontend",
        description: "Frontend Developer Assessment",
        order: 3,
        data: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: "telegram",
          duration: 5400000, // 1.5 hours in milliseconds
        }),
        tag: "frontend",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("tryout_sections", tryouts, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("tryout_sections", {}, {});
  },
};
