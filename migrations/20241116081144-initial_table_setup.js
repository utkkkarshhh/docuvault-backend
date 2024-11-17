"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create UserLogin table
    await queryInterface.createTable("user_login", {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // Create Document table
    await queryInterface.createTable("document", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: true },
      link: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isUrl: true },
      },
      format: { type: Sequelize.STRING, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "user_login", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // Create PublicVisibility table
    await queryInterface.createTable("public_visibility", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      public_visibility: { type: Sequelize.BOOLEAN, allowNull: false },
      public_password: { type: Sequelize.STRING, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "user_login", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // Create UserDetails table
    await queryInterface.createTable("user_details", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING, allowNull: true },
      bio: { type: Sequelize.TEXT, allowNull: true },
      dob: { type: Sequelize.DATEONLY, allowNull: true },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "user_login", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // Create UserLimit table
    await queryInterface.createTable("user_limit", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      limit: { type: Sequelize.INTEGER, defaultValue: 6, allowNull: false },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "user_login", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_limit");
    await queryInterface.dropTable("user_details");
    await queryInterface.dropTable("public_visibility");
    await queryInterface.dropTable("document");
    await queryInterface.dropTable("user_login");
  },
};
