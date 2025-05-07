import { User } from "../models";

export const up = async () => {
  await User.bulkCreate([
    { name: "Alief", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Nadya", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Budi", avatar: "https://i.pravatar.cc/150?img=3" },
  ]);
};

export const down = async () => {
  await User.destroy({ where: {} });
};
