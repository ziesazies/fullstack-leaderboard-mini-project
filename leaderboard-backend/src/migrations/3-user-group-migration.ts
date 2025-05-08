import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("users_groups", {
      id: {
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4,
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
      groupId: {
        type: DataTypes.CHAR(36),
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
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("users_groups");
  },
};
