'use strict';
const productSchema = require('./product.schema');
const productClassMethods = require('./product.classMethods');

class Product {
    getDefinition(sequelize, DataTypes) {
        let schema = productSchema.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('product', schema, options);
        productClassMethods.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let product = new Product();
    return product.getDefinition(sequelize, DataTypes);
}