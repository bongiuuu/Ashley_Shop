'use strict';

const Promise = require('bluebird');
const Sequelize = require('sequelize');
const config = require('config')
// const logger = require('../shared/logger')('shared:data:db');
//const uuid = require('uuid');
const fs = require('fs');
let sequelize = null;

class Db {
    constructor() {
        console.log('constructor start');
        if (!sequelize) {
            console.log('creating singleton instance');
            console.log(`new instance of sequelize with config - dbname: ${config.db.dbname} - username: ${config.db.username} - dialect: ${config.db.options.dialect}`);

            let dialectOptions = config.db.options.dialectOptions || {};
            dialectOptions = {
                useUTC: false, //for reading from database
                dateStrings: true,
                typeCast: function (field, next) { // for reading from database
                    if (field.type === 'DATE') {
                        return field.string()
                    }
                    return next()
                }
            }
            if (config.db.ssl !== undefined) {
                let ssl = {
                    ca: fs.readFileSync(config.db.ssl.ca),
                    cert: fs.readFileSync(config.db.ssl.cert),
                    key: fs.readFileSync(config.db.ssl.key)
                }
                dialectOptions['ssl'] = ssl;
            }
            if (config.db.socketPath !== undefined && config.db.socketPath !== '') {
                dialectOptions['socketPath'] = config.db.socketPath;
            }
            let options = config.db.options;
            options['dialectOptions'] = dialectOptions;
            console.log('connection config', options);

            sequelize = new Sequelize(config.db.dbname, config.db.username, config.db.password, options);
        }
    }

    connect() {
        console.log('connect start');
        let connectPromise = sequelize.authenticate()
            .then(() => {
                console.log('sequelize authenticated');
                return sequelize.sync({ force: config.recreateDB })
                    .then(() => {
                        console.log('sequelize synced');
                        return sequelize;
                    })
            }).catch((error) => {
                throw error;
            })
        this.initModels();
        return connectPromise;
    }

    get sequelize() {

        return sequelize;
    }

    //merge the properties from models into this Db object
    initModels() {
        console.log('initialize models');
        // this.cars = sequelize.import('./cars');
        // this.reservation = sequelize.import('./reservation')
        this.user = sequelize.import('./user')
        this.access_tokens = sequelize.import('./access_token')
        this.category = sequelize.import('./category')
        this.product = sequelize.import('./product')
        this.cart = sequelize.import('./cart')
        this.banner = sequelize.import('./banner')
        this.cartItem = sequelize.import('./cart_item')

        // this.cars.belongsTo(this.user, { as: 'user', foreignKey: 'userId' })
        // this.user.hasMany(this.cars, { as: 'cars', foreignKey: 'userId' })

        this.cart.hasMany(this.cartItem, { as: 'cartItem', foreignKey: 'cartId'})
        this.cartItem.belongsTo(this.cart, { as: 'cart', foreignKey: 'cartId' })
      
        this.cartItem.belongsTo(this.product, { as: 'product', foreignKey: 'productId' })

        this.product.belongsTo(this.category, { as: 'category', foreignKey: 'categoryId' })


    }

    initData() {
    }
}

module.exports = new Db();
