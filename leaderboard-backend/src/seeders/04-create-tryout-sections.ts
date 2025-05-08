// src/seeders/20230507-create-tryout-sections.ts

import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    const tryouts = [
      {
        id: "tryout-1",
        code: "AGAT",
        title: "Tryout Fullstack",
        data: JSON.stringify({}),
        tag: "general",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "tryout-2",
        code: "AGST",
        title: "Tryout Backend",
        data: JSON.stringify({}),
        tag: "backend",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("tryout_sections", tryouts, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("tryout_sections", {}, {});
  },
};
