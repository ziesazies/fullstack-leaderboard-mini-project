// src/seeders/20230507-create-users.ts

import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    const users = Array.from({ length: 20 }, (_, i) => ({
      id: `user-${i + 1}`,
      fullname: `User ${i + 1}`,
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      phoneNumber: `0812345678${i}`,
      password: "hashedpass",
      active: true,
      data: JSON.stringify({}),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("users", users, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("users", {}, {});
  },
};
