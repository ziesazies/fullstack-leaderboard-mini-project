import { DataTypes, Model, Optional, Sequelize } from "sequelize";
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

export default (sequelize: Sequelize) => {
  class TryoutSection extends Model<
    TryoutSectionAttributes,
    TryoutSectionCreationAttributes
  > {}

  TryoutSection.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      timestamps: false,
    }
  );
};
