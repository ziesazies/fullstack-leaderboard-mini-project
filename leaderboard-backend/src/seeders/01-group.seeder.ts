import { Group } from "../models";

export const up = async () => {
  await Group.bulkCreate([
    { name: "Batch 1 Dev", department: "Engineering", batch: "1" },
    { name: "Batch 2 Design", department: "Design", batch: "2" },
  ]);
};

export const down = async () => {
  await Group.destroy({ where: {} });
};
