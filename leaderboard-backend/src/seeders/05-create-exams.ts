// src/seeders/20230507-create-exams.ts

import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    const now = new Date();
    const oneHour = 60 * 60 * 1000;

    const exams = [
      {
        id: "exam-1",
        userId: "user-1",
        data: JSON.stringify({
          scores: 60,
          status: "submitted",
          startTime: now,
          endTime: new Date(now.getTime() + oneHour),
          duration: oneHour,
          tryoutSectionId: "tryout-1",
        }),
        tag: "exam",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "exam-2",
        userId: "user-2",
        data: JSON.stringify({
          scores: 75,
          status: "submitted",
          startTime: now,
          endTime: new Date(now.getTime() + oneHour * 0.8),
          duration: oneHour,
          tryoutSectionId: "tryout-1",
        }),
        tag: "exam",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "exam-3",
        userId: "user-3",
        data: JSON.stringify({
          scores: 80,
          status: "submitted",
          startTime: now,
          endTime: new Date(now.getTime() + oneHour * 0.6),
          duration: oneHour,
          tryoutSectionId: "tryout-2",
        }),
        tag: "exam",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("exams", exams, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("exams", {}, {});
  },
};
