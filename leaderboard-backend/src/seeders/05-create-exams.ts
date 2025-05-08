// src/seeders/05-create-exams.ts

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
          startTime: now.toISOString(),
          endTime: new Date(now.getTime() + oneHour).toISOString(),
          duration: oneHour,
          tryoutSectionId: "tryout-1",
          type: "accuracy_test",
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
          startTime: now.toISOString(),
          endTime: new Date(now.getTime() + oneHour * 0.8).toISOString(),
          duration: oneHour,
          tryoutSectionId: "tryout-1",
          type: "telegram",
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
          startTime: now.toISOString(),
          endTime: new Date(now.getTime() + oneHour * 0.6).toISOString(),
          duration: oneHour,
          tryoutSectionId: "tryout-2",
          type: "website",
        }),
        tag: "exam",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      // Add more exam data for better leaderboard testing
      {
        id: "exam-4",
        userId: "user-4",
        data: JSON.stringify({
          scores: 85,
          status: "submitted",
          startTime: now.toISOString(),
          endTime: new Date(now.getTime() + oneHour * 0.5).toISOString(),
          duration: oneHour,
          tryoutSectionId: "tryout-2",
          type: "accuracy_test",
        }),
        tag: "exam",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "exam-5",
        userId: "user-5",
        data: JSON.stringify({
          scores: 70,
          status: "submitted",
          startTime: now.toISOString(),
          endTime: new Date(now.getTime() + oneHour * 0.9).toISOString(),
          duration: oneHour,
          tryoutSectionId: "tryout-1",
          type: "website",
        }),
        tag: "exam",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "exam-6",
        userId: "user-6",
        data: JSON.stringify({
          scores: 95,
          status: "submitted",
          startTime: now.toISOString(),
          endTime: new Date(now.getTime() + oneHour * 0.4).toISOString(),
          duration: oneHour,
          tryoutSectionId: "tryout-1",
          type: "telegram",
        }),
        tag: "exam",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "exam-7",
        userId: "user-7",
        data: JSON.stringify({
          scores: 92,
          status: "submitted",
          startTime: now.toISOString(),
          endTime: new Date(now.getTime() + oneHour * 0.45).toISOString(),
          duration: oneHour,
          tryoutSectionId: "tryout-2",
          type: "website",
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
