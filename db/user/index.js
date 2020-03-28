'use strict';
const schemaDb = require('./user.schema');
const classMethodsDb = require('./user.classMethods');

class User {
    getDefinition(sequelize, DataTypes) {
        let schema = schemaDb.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('user', schema, options);
        classMethodsDb.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let db = new User();
    return db.getDefinition(sequelize, DataTypes);
}