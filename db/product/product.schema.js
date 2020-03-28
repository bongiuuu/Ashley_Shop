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
            desVn: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'des_vn'
            },
            desEn: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'des_en'
            },
            briefEn: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'brief_en'
            },
            briefVn: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'brief_vn'
            },
            newPrice: {
                type: DataTypes.STRING,
                field: 'new_price'
            },
            oldPrice: {
                type: DataTypes.STRING,
                field: 'old_price'
            },
            total: {
                type: DataTypes.INTEGER,
                field: 'total'
            },  
            categoryId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                field: 'category_id'
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
                field: 'created_date'
            }
        };
    }
}
module.exports = new ProductSchema();