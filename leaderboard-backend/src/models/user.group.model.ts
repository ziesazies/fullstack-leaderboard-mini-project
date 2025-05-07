import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { UserGroupAttributes } from "../types/user.group.type";

export type UserGroupCreationAttributes = Optional<
  UserGroupAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export default (sequelize: Sequelize) => {
  class UserGroup extends Model<
    UserGroupAttributes,
    UserGroupCreationAttributes
  > {}

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
};
