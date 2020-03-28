const cartHandler = require('../core/handler/cart.handler');
const cResponse = require('../response/response');
var express = require('express')
var router = express.Router()


class Cart {
    carsRoutes() {
    
        router.route('/').get((req, res, next) => {
            let query = req.query
            return cartHandler.getAll(query).then((carts) => {
                cResponse.ok(res, carts)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });


        router.route('/').post((req, res, next) => {
            return cartHandler.add(req).then((carts) => {
                cResponse.ok(res, carts)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        router.route('/:id').get((req, res, next) => {
            return cartHandler.getCartById(req.params.id).then((cart) => {
                cResponse.ok(res, cart)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        router.route('/').put((req, res, next) => {
            return cartHandler.update(req).then((cart) => {
                cResponse.ok(res, cart)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        return router;
    }
}
const cartRoutes = new Cart();
module.exports = cartRoutes.carsRoutes();