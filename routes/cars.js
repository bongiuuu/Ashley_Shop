const carsHandler = require('../core/handler/cars.handler');
const cResponse = require('../response/response');
var express = require('express')
var router = express.Router()


class Cars {
    carsRoutes() {
        router.route('/listAll').get((req, res, next) => {
            let query = req.query
            return carsHandler.listAll(query).then((cars) => {
                cResponse.ok(res, cars)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        router.route('/').post((req, res, next) => {
            let query = req.query
            return carsHandler.listAll(query).then((cars) => {
                cResponse.ok(res, cars)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });


        return router;
    }
}
const carsRoutes = new Cars();
module.exports = carsRoutes.carsRoutes();