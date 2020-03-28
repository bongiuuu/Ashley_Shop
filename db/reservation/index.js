'use strict';
const reservationSchema = require('./reservation.schema');
const eservationClassMethods = require('./reservation.classMethods');

class Reservation {
    getDefinition(sequelize, DataTypes) {
        let schema = reservationSchema.getSchema(DataTypes);
        let options = { freezeTableName: true, timestamps: false };
        let model = sequelize.define('reservation', schema, options);
        eservationClassMethods.getClassMethods(model);
        return model;
    }
}

module.exports = (sequelize, DataTypes) => {
    let cars = new Reservation();
    return cars.getDefinition(sequelize, DataTypes);
}