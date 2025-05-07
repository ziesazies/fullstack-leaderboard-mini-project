import { TryoutSection } from "../models";

export const up = async () => {
  await TryoutSection.bulkCreate([
    {
      title: "Tryout Website A",
      type: "website",
      startDate: new Date("2025-05-01"),
      endDate: new Date("2025-05-30"),
    },
    {
      title: "Tryout Telegram B",
      type: "telegram",
      startDate: new Date("2025-05-05"),
      endDate: new Date("2025-05-20"),
    },
    {
      title: "Accuracy Test C",
      type: "accuracy_test",
      startDate: new Date("2025-05-10"),
      endDate: new Date("2025-05-25"),
    },
  ]);
};

export const down = async () => {
  await TryoutSection.destroy({ where: {} });
};
