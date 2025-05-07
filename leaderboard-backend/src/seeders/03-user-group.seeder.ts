import { User, Group, UserGroup } from "../models";

export const up = async () => {
  const users = await User.findAll();
  const groups = await Group.findAll();

  await UserGroup.bulkCreate([
    { userId: users[0].id, groupId: groups[0].id },
    { userId: users[1].id, groupId: groups[0].id },
    { userId: users[2].id, groupId: groups[1].id },
  ]);
};

export const down = async () => {
  await UserGroup.destroy({ where: {} });
};
