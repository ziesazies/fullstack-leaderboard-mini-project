import { Exam, User, TryoutSection } from "../models";

export const up = async () => {
  const users = await User.findAll();
  const tryouts = await TryoutSection.findAll();

  await Exam.bulkCreate([
    {
      userId: users[0].id,
      tryoutSectionId: tryouts[0].id,
      score: 85,
      duration: 300000, // 5 minutes
      data: {
        type: "website",
        status: "completed",
      },
      elapsedTime: 0,
    },
    {
      userId: users[1].id,
      tryoutSectionId: tryouts[1].id,
      score: 90,
      duration: 250000,
      data: {
        type: "telegram",
        status: "completed",
      },
      elapsedTime: 0,
    },
    {
      userId: users[2].id,
      tryoutSectionId: tryouts[2].id,
      score: 70,
      duration: 400000,
      submittedAt: new Date(),
      data: {
        type: "accuracy_test",
        status: "completed",
      },
      elapsedTime: 0,
    },
  ]);
};

export const down = async () => {
  await Exam.destroy({ where: {} });
};
