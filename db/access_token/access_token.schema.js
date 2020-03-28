'use strict';
class AccessTokenchema {
    getSchema(DataTypes) {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV1
            },
            userId: {
                type: DataTypes.STRING,
                field: 'user_id'
            },
            token: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.INTEGER,
            },
            created: {
                type: DataTypes.DATE,
            }

        };
    }
}
module.exports = new AccessTokenchema();