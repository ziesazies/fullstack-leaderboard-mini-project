import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import { GroupAttributes } from "../types/group.type";

export type GroupCreationAttributes = Optional<
  GroupAttributes,
  "id" | "parentId" | "data" | "tag" | "active" | "createdAt" | "updatedAt"
>;

class Group extends Model<GroupAttributes, GroupCreationAttributes> {
  static associate(models: any) {
    Group.belongsToMany(models.User, {
      through: models.UserGroup,
      foreignKey: "groupId",
      as: "users",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Group.hasMany(models.Group, {
      foreignKey: "parentId",
      as: "children",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Group.belongsToMany(models.Group, {
      through: models.UserGroup,
      foreignKey: "groupId",
      as: "children",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

Group.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      // defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      defaultValue: null,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: "Group",
    tableName: "groups",
    timestamps: true,
  }
);

export default Group;
