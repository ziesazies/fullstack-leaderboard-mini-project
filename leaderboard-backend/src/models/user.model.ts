import { Model, DataTypes, Optional } from "sequelize";
import { UserAttributes } from "../types/user.type";
import sequelize from "../config/database";

export type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "active" | "data" | "createdAt" | "updatedAt"
>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  static associate(models: any) {
    User.hasMany(models.Exam, {
      foreignKey: "userId",
      as: "exams",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.belongsToMany(models.Group, {
      through: models.UserGroup,
      foreignKey: "userId",
      as: "groups",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "User", tableName: "users" }
);

export default User;
