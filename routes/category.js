const categoryHandler = require('../core/handler/category.handler');
const cResponse = require('../response/response');
var express = require('express')
var router = express.Router()


class Category {
    categoryRoutes() {
    
        router.route('/').get((req, res, next) => {
            let query = req.query
            return categoryHandler.getAll(query).then((category) => {
                cResponse.ok(res, category)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        router.route('/').post((req, res, next) => {
            return categoryHandler.add(req).then((category) => {
                cResponse.ok(res, category, 200)
            }).catch((error) => {
                cResponse.fail(res, error.message)
            })
        });

        return router;
    }
    
}
const categoryRoutes = new Category();
module.exports = categoryRoutes.categoryRoutes();