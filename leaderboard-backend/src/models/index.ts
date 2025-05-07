import sequelize from "../config/database";
import User from "./user.model";
import Group from "./group.model";
import UserGroup from "./user.group.model";
import TryoutSection from "./tryout.section.model";
import Exam from "./exam.model";

// Associations
User.belongsToMany(Group, { through: UserGroup, foreignKey: "userId" });
Group.belongsToMany(User, { through: UserGroup, foreignKey: "groupId" });

User.hasMany(Exam, { foreignKey: "userId" });
Exam.belongsTo(User, { foreignKey: "userId" });

TryoutSection.hasMany(Exam, { foreignKey: "tryoutSectionId" });
Exam.belongsTo(TryoutSection, { foreignKey: "tryoutSectionId" });

export { sequelize, User, Group, UserGroup, TryoutSection, Exam };
