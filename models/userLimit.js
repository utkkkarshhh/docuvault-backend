const { DataTypes } = require("sequelize");

const UserLimit = (sequelize) => {
  return sequelize.define(
    "UserLimit",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      limit: {
        type: DataTypes.INTEGER,
        defaultValue: 6,
        allowNull: false,
        validate: {
          min: 0,
          max: 6,
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user_login",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "user_limit",
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
};

module.exports = UserLimit;
