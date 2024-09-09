const config = require("./dbConfig");
const { Pool } = require("pg");

const db = new Pool(config.db);

db.on("connect", () => {
  console.log("Connected to the database");
});

db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = db;
