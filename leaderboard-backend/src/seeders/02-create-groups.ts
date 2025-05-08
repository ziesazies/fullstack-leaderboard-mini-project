// src/seeders/20230507-create-groups.ts

import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    const groups = [
      {
        id: "group-1",
        code: "GRP01",
        title: "Alpha Squad",
        parentId: null,
        data: JSON.stringify({}),
        tag: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "group-2",
        code: "GRP02",
        title: "Beta Squad",
        parentId: null,
        data: JSON.stringify({}),
        tag: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "group-3",
        code: "GRP03",
        title: "Gamma Squad",
        parentId: null,
        data: JSON.stringify({}),
        tag: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("groups", groups, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("groups", {}, {});
  },
};
