const { Sequelize } = require("sequelize");

const db = new Sequelize(
  "railway",
  "root",
  "uLWaYxjxdgEpZFdlBtcGJDMOqXnTXoKc",
  {
    host: "mysql-production-bc34.up.railway.app",
    dialect: "mysql",
    port: 3307,
    logging: false,
  }
);

try {
  db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = db;
