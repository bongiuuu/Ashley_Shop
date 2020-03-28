'use strict';
const categorySchema = require('./category.schema');
const categoryClassMethods = require('./category.classMethods');

class Category {
    getDefinition(sequelize, DataTypes) {
        let schema = categorySchema.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('category', schema, options);
        categoryClassMethods.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let category = new Category();
    return category.getDefinition(sequelize, DataTypes);
}