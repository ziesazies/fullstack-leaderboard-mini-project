// src/seeders/20230507-create-user-groups.ts

import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    const userGroups = [
      { id: "ug-1", userId: "user-1", groupId: "group-1" },
      { id: "ug-2", userId: "user-2", groupId: "group-1" },
      { id: "ug-3", userId: "user-3", groupId: "group-2" },
      { id: "ug-4", userId: "user-4", groupId: "group-2" },
      { id: "ug-5", userId: "user-5", groupId: "group-3" },
      { id: "ug-6", userId: "user-6", groupId: "group-3" },
      { id: "ug-7", userId: "user-7", groupId: "group-1" },
      { id: "ug-8", userId: "user-8", groupId: "group-2" },
      { id: "ug-9", userId: "user-9", groupId: "group-3" },
      { id: "ug-10", userId: "user-10", groupId: "group-1" },
    ].map((ug) => ({
      ...ug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("users_groups", userGroups, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("users_groups", {}, {});
  },
};
