import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { TryoutSectionAttributes } from "../types/tryout.sections.type";

export type TryoutSectionCreationAttributes = Optional<
  TryoutSectionAttributes,
  | "id"
  | "description"
  | "order"
  | "data"
  | "tag"
  | "active"
  | "createdAt"
  | "updatedAt"
>;

class TryoutSection extends Model<
  TryoutSectionAttributes,
  TryoutSectionCreationAttributes
> {
  // static associate(models: any) {
  //   // Add association if needed
  //   // For example, a tryout section could have many exams
  // }
}

TryoutSection.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
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
    modelName: "TryoutSection",
    tableName: "tryout_sections",
    timestamps: true,
  }
);

export default TryoutSection;
