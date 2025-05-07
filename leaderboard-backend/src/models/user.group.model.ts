import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { UserGroupAttributes } from "../types/user.group.type";

export type UserGroupCreationAttributes = Optional<
  UserGroupAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class UserGroup extends Model<
  UserGroupAttributes,
  UserGroupCreationAttributes
> {
  static associate(models: any) {
    UserGroup.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    UserGroup.belongsTo(models.Group, {
      foreignKey: "groupId",
      as: "group",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

UserGroup.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "groups",
        key: "id",
      },
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
  {
    sequelize,
    modelName: "UserGroup",
    tableName: "users_groups",
  }
);

export default UserGroup;
