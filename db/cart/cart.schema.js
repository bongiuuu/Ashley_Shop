'use strict';
class ProductSchema {
    getSchema(DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            nameVn: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'name_vn'
            },
            nameEn: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'name_en'
            },
            phone: {
                type: DataTypes.STRING,
                field: 'phone'
            },
            email: {
                type: DataTypes.STRING,
                field: 'email'
            },
            note: {
                type: DataTypes.STRING,
                field: 'note'
            },
            status: {
                type: DataTypes.STRING,
                field: 'status'
            },
            total: {
                type: DataTypes.INTEGER,
                field: 'total'
            },
            priority: {
                defaultValue: 1,
                type: DataTypes.INTEGER,
                field: 'priority'
            },
            isDeleted: {
                type: DataTypes.INTEGER(1),
                allowNull: true,
                defaultValue: 0
            },
            createdDate: {
                defaultValue : new Date(),
                type: DataTypes.DATE,
                field: 'created_date',
            },
        };
    }
}
module.exports = new ProductSchema();