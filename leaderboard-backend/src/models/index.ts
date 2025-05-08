import UserModel from "./user.model";
import GroupModel from "./group.model";
import UserGroupModel from "./user.group.model";
import TryoutSectionModel from "./tryout.section.model";
import ExamModel from "./exam.model";

const db = {
  User: UserModel,
  Group: GroupModel,
  UserGroup: UserGroupModel,
  TryoutSection: TryoutSectionModel,
  Exam: ExamModel,
};

// Initialize associations
UserModel.associate(db);
GroupModel.associate(db);
UserGroupModel.associate(db);
// TryoutSectionModel.associate && TryoutSectionModel.associate(db);
ExamModel.associate(db);

export default db;
