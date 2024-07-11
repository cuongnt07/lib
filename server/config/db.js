const { Sequelize } = require("sequelize");

const db = new Sequelize(
  "perform_library",
  "root",
  "171ca9e4eb6168007db9fa1da1091480f211e39c2ed8cc56cd6d6d25b09a",
  {
    host: "222.252.24.27",
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
