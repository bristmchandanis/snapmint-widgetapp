const { Sequelize } = require("sequelize");

// Config modules
const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = require("./constants");

// Initialize Sequelize with optimized configuration for PostgreSQL
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 2,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
