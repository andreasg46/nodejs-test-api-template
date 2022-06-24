const {DataTypes} = require('sequelize')
const db = require('../configs/db_config')
const User = require('./user')

const Hash = db.define('Hash', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'hash',
    timestamps: false
});

Hash.belongsTo(User);

module.exports = Hash;