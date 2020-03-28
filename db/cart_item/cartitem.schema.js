'use strict';
class CartItemSchema {
    getSchema(DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            cartId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                field: 'cart_id'
            },
            productId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                field: 'product_id'
            },
            nameVn: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'product_name_vn'
            },
            nameEn: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'product_name_en'
            },
            priceUnit: {
                type: DataTypes.STRING,
                field: 'price_unit'
            },
            quatity: {
                allowNull: true,
                defaultValue: 0,
                type: DataTypes.INTEGER,
                field: 'quatity'
            },
            totalPrice: {
                type: DataTypes.INTEGER,
                field: 'total_price'
            },
            isDeleted: {
                type: DataTypes.INTEGER(1),
                allowNull: true,
                defaultValue: 0
            },
            priority: {
                defaultValue: 1,
                type: DataTypes.INTEGER,
                field: 'priority'
            },
            createdDate: {
                defaultValue : new Date(),
                type: DataTypes.DATE,
                field: 'created_date'
            },
        };
    }
}
module.exports = new CartItemSchema();