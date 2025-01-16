const { DataTypes } = require("sequelize");

const PublicVisibility = (sequelize) => {
  return sequelize.define(
    "PublicVisibility",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      public_visibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      public_password: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
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
      tableName: "public_visibility",
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
};

module.exports = PublicVisibility;
