'use strict';
const moment = require('moment')
class UsersSchema {
    getSchema(DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'username'
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'password'
            },
            fullName: {
                type: DataTypes.STRING,
                field: 'full_name'
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            telephone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isDeleted: {
                type: DataTypes.INTEGER(1),
                allowNull: true,
                defaultValue: 0
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'role'
            },
            createdDate: {
                allowNull: true,
                type: DataTypes.DATE,
                field: 'created_date',
                defaultValue : new Date()
            },
        };
    }
}
module.exports = new UsersSchema();