const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
  }
);

const connectToSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established with Postgres via Sequelize!");
  } catch (error) {
    console.log("Error connecting to Postgres Database via Sequelize!", error);
  }
};

module.exports = { connectToSequelize, sequelize };
