const { Sequelize } = require('sequelize');

const db = new Sequelize('mysql://root:mysqlpw@localhost:49155/nodejs-db')

// Sync DB
async function init() {
    await db.sync();
}

init();


// Sync DB
async function init() {
    await db.sync();
}

init();

module.exports = db;