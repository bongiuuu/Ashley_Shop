'use strict';
class CarsSchema {
    getSchema(DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            model: {
                type: DataTypes.STRING,
            },
            year: {
                type: DataTypes.INTEGER,
            },
            door: {
                type: DataTypes.INTEGER,
                defaultValue: 4
            }, userId: {
                type: DataTypes.INTEGER(11),
                field: 'userId'
            },
        };
    }
}
module.exports = new CarsSchema();