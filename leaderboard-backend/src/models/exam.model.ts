import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { ExamAttributes } from "../types/exam.type";

export type ExamCreationAttributes = Optional<
  ExamAttributes,
  "id" | "data" | "tag" | "active" | "createdAt" | "updatedAt"
>;

export default (sequelize: Sequelize) => {
  class Exam extends Model<ExamAttributes, ExamCreationAttributes> {
    static associate(models: any) {
      Exam.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Exam.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
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
      tableName: "exams",
      modelName: "Exam",
    }
  );
  return Exam;
};
