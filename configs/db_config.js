const { Sequelize } = require('sequelize');

// MySQL
// const db = new Sequelize('mysql://root:mysqlpw@localhost:49155/nodejs-db')

// SQLite
// const db = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'configs/nodejs-database.db'  // ...and point to the DB file
// });

// Postgres
const db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres"
});

// Sync DB
async function init() {
    await db.sync();
}

init();

module.exports = db;