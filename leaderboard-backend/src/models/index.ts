import UserModel from "./user.model.js";
import GroupModel from "./group.model.js";
import UserGroupModel from "./user.group.model.js";
import TryoutSectionModel from "./tryout.section.model.js";
import ExamModel from "./exam.model";

const db = {
  User: UserModel,
  Group: GroupModel,
  UserGroup: UserGroupModel,
  TryoutSection: TryoutSectionModel,
  Exam: ExamModel,
};

UserModel.associate(db);
GroupModel.associate(db);
UserGroupModel.associate(db);
ExamModel.associate(db);

export default db;
