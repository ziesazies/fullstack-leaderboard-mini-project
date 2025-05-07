import UserModel from "./user.model.js";
import GroupModel from "./group.model.js";
import UserGroupModel from "./user.group.model.js";
import TryoutSectionModel from "./tryout.section.model.js";
import ExamModel from "./exam.model.js";

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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import fs from "fs";
// import path from "path";
// import { Sequelize, DataTypes } from "sequelize";
// import process from "process";
// import configJson from "../config/db.config.js";
// import { DBConfig } from "../types/config.type.js";
// import { pathToFileURL } from "url";
// import { getDirname, getBasename } from "../global/path.global.js";

// const appModels: any = [];

// const __dirname = getDirname(import.meta.url);
// const basename = getBasename(import.meta.url);

// const env = (process.env.NODE_ENV as keyof typeof configJson) || "development";
// const config: DBConfig = configJson[env];

// interface DB {
//   sequelize: Sequelize;
//   Sequelize: typeof Sequelize;
//   [key: string]: any;
// }

// const db: DB = { Sequelize } as DB;

// let sequelize: Sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(
//     process.env[config.use_env_variable] as string,
//     config as any
//   );
// } else {
//   sequelize = new Sequelize(
//     config.database ?? "",
//     config.username ?? "",
//     config.password ?? "",
//     config as any
//   );
// }

// const loadModels = async () => {
//   const extension = process.env.NODE_ENV === "production" ? ".js" : ".ts";
//   console.log(extension);
//   console.log(__dirname);
//   const files = fs.readdirSync(__dirname).filter((file) => {
//     return (
//       !file.startsWith(".") &&
//       file !== basename &&
//       file.endsWith(".js") &&
//       file.indexOf(".test" + extension) === -1
//     );
//   });
//   const modelImports = files.map(
//     (file) => import(pathToFileURL(path.join(__dirname, file)).href)
//   );
//   let models = await Promise.all(modelImports);
//   appModels.forEach((appModel: any) => {
//     models = models.concat(appModel.default);
//   });
//   models.forEach((modelModule) => {
//     const model = modelModule.default(sequelize, DataTypes);
//     db[model.name] = model;
//   });
//   Object.keys(db).forEach((modelName) => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });
// };

// await loadModels();

// db.sequelize = sequelize;

// export default db;
