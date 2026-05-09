const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    birth_date: {
        type: DataTypes.DATEONLY
    },
    address: {
        type: DataTypes.TEXT
    },
    class_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'classes',
            key: 'id'
        }
    }
}, {
    tableName: 'students',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Student;