const { Sequelize } = require("sequelize");
require("dotenv").config();
var pg = require("pg");
pg.defaults.ssl = true;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
