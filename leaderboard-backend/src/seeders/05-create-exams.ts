// src/seeders/05-create-exams.ts

import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export = {
  up: async (queryInterface: QueryInterface) => {
    const tryoutSections = [
      { id: "tryout-1", title: "Tryout Corporate Champion Mentality" },
      { id: "tryout-2", title: "Tryout Growth Mindset Adaptation" },
      { id: "tryout-3", title: "Tryout Agile Execution Practice" },
    ];

    const exams = Array.from({ length: 50 }, (_, i) => {
      const userId = `user-${(i % 20) + 1}`;
      const tryoutSection = tryoutSections[i % tryoutSections.length];
      const type = ["accuracy_test", "telegram", "website"][i % 3];
      const duration = 60 * 60 * 1000; // 1 hour

      const startTime = new Date();
      const endTime = new Date(
        startTime.getTime() + duration * (Math.random() * 0.5 + 0.5) // 50% - 100% duration
      );

      // Fixed scores based on index
      let scores = 80;
      if (i < 20) scores = 100;
      else if (i < 40) scores = 90;

      // Still generate 100 questions (optional for realism)
      const questions = Array.from({ length: 100 }, () => {
        const id = uuidv4();
        const score = Math.random() > 0.5 ? 1 : 0;
        const answer = ["a", "b", "c", "d"][Math.floor(Math.random() * 4)];
        const examAnswer = ["a", "b", "c", "d"][Math.floor(Math.random() * 4)];
        const scrambledLabel = ["a", "b", "c", "d"].map((label) => ({
          label,
          examLabel: ["a", "b", "c", "d"][Math.floor(Math.random() * 4)],
        }));

        return {
          id,
          score,
          answer,
          imageType: "asset",
          examAnswer,
          scrambledLabel,
          tryoutSections: [{ id: tryoutSection.id }],
        };
      });

      return {
        id: `exam-${i + 1}`,
        userId,
        data: JSON.stringify({
          scores,
          status: "submitted",
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          platform: type,
          questions,
          tryoutSectionId: tryoutSection.id,
          tryoutSectionTitle: tryoutSection.title,
          type,
        }),
        tag: "exam",
        active: true,
        createdAt: startTime,
        updatedAt: startTime,
      };
    });

    await queryInterface.bulkInsert("exams", exams, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("exams", {}, {});
  },
};
