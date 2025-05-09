// src/seeders/20230507-create-user-groups.ts

import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    const userGroups = Array.from({ length: 20 }, (_, i) => ({
      id: `ug-${i + 1}`,
      userId: `user-${i + 1}`,
      groupId: `group-${(i % 3) + 1}`, // Round-robin assignment to 3 groups
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("users_groups", userGroups, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("users_groups", {}, {});
  },
};
