const {DataTypes} = require('sequelize')
const db = require('../configs/db_config')
const Hash = require("./hash");

const Account = db.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
}, {
    tableName: 'account',
    timestamps: true
});

Account.hasOne(Hash);

module.exports = Account;