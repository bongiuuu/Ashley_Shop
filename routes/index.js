const carsRouter = require('./cars');
const userRouter = require('./user');
const loginRouter = require('./auth');
const cartRouter = require('./cart');
const productRouter = require('./product');
const categoryRouter = require('./category');
const config = require('config');
const apiRoutes = require('express').Router();

class RouterIndex {

    constructor(app) {
        this.app = app
    }

    registerRoutes() {
        this.app.use(config.router_root, apiRoutes)
        apiRoutes.use('/cars', carsRouter)
        apiRoutes.use('/user', userRouter)
        apiRoutes.use('/auth', loginRouter)
        apiRoutes.use('/cart', cartRouter)
        apiRoutes.use('/category', categoryRouter)
        apiRoutes.use('/product', productRouter)
    }

}

module.exports = (app) => { return new RouterIndex(app) }