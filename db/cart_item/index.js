'use strict';
const cartitemSchema = require('./cartitem.schema');
const cartitemClassMethods = require('./cartitem.classMethods');

class CartItem {
    getDefinition(sequelize, DataTypes) {
        let schema = cartitemSchema.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('cart_item', schema, options);
        cartitemClassMethods.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let cartitem = new CartItem();
    return cartitem.getDefinition(sequelize, DataTypes);
}