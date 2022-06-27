const {DataTypes} = require('sequelize')
const db = require('../configs/db_config')

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
}, {
    tableName: 'hash',
    timestamps: false
});

module.exports = Hash;