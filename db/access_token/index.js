'use strict';
const Schema = require('./access_token.schema');
const ClassMethods = require('./access_token.classMethods');

class AccessTokens {
    getDefinition(sequelize, DataTypes) {
        let schema = Schema.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('access_tokens', schema, options);
        ClassMethods.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let token = new AccessTokens();
    return token.getDefinition(sequelize, DataTypes);
}