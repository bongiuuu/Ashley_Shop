'use strict';
const cartSchema = require('./cart.schema');
const cartClassMethods = require('./cart.classMethods');

class Cart {
    getDefinition(sequelize, DataTypes) {
        let schema = cartSchema.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('cart', schema, options);
        cartClassMethods.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let cart = new Cart();
    return cart.getDefinition(sequelize, DataTypes);
}