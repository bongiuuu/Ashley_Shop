const handler = require('../core/handler/user.handler');
const cResponse = require('../response/response');
var express = require('express')
var router = express.Router()
const guard = require('../guard')

class User {
    routes() {
        router.route('/').get(guard.protect,(req, res, next) => {
            let query = req.query
            return handler.listAll(query).then((cars) => {
                cResponse.ok(res, cars)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        router.route('/').post((req, res, next) => {
            let query = req.query
            return handler.add(req,res).then((cars) => {
                cResponse.ok(res, cars, 200)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        router.route('/').put((req, res, next) => {
            return handler.update(req).then((cars) => {
                cResponse.ok(res, cars)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        router.route('/:id').get((req, res, next) => {
            return handler.getUserById(req).then((cars) => {
                cResponse.ok(res, cars)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        
        // router.route('/:id').get(guard.protect,(req, res, next) => {
        //     return handler.getUserById(req).then((cars) => {
        //         cResponse.ok(res, cars)
        //     }).catch((error) => {
        //         cResponse.fail(res, error.message)
        //     })
        // });

        return router;
    }
}
const routes = new User();
module.exports = routes.routes();