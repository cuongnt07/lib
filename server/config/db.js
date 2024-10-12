const { Sequelize } = require("sequelize");

const db = new Sequelize("defaultdb", "avnadmin", "AVNS_3Ouri7MDV38SULfCToP", {
  host: "mysql-1df41839-cuongnguyen26072002-6d7e.l.aivencloud.com",
  dialect: "mysql",
  port: 13720,
  logging: false,
});

try {
  db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = db;
