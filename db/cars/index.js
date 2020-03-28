'use strict';
const carsSchema = require('./cars.schema');
const carsClassMethods = require('./cars.classMethods');

class Cars {
    getDefinition(sequelize, DataTypes) {
        let schema = carsSchema.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('cars', schema, options);
        carsClassMethods.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let cars = new Cars();
    return cars.getDefinition(sequelize, DataTypes);
}