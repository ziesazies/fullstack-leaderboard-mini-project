import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import { ExamAttributes } from "../types/exam.type";

export type ExamCreationAttributes = Optional<
  ExamAttributes,
  "id" | "data" | "tag" | "active" | "createdAt" | "updatedAt"
>;

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
      type: DataTypes.CHAR(36),
      // defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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

export default Exam;
