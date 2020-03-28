'use strict';
var express = require('express');
var router = express.Router();
const authHandler = require('../core/auth/auth');
var logger = require('../shared/logger')('routes:welcome');
const guard = require('../guard')
const config = require('config')
const cResponse = require('../response/response');

class AuthRouter {
  registerRoutes() {
    router.route('/login')
      .post((req, res, next) => {
        // let gocarAuthentication = req.header('gocar-authentication');

        const username = req.body.username;
        const password = req.body.password;
        
        return authHandler.login(username, password).then((user) => {
          cResponse.ok(res, user)
        }).catch((error) => {
          cResponse.fail(res, error.message, error.code)
        })
      });
    router.route('/logout')
      .post(guard.protect, (req, res, next) => {
        return authHandler.logout(req.headers[config.TOKEN_KEY]).then((user) => {
          cResponse.ok(res, user)
        }).catch((error) => {
          cResponse.fail(res, error.message, error.code)
        })
      });
    router.route('/role/acesses')
      .get(guard.protect, (req, res, next) => {
        return authHandler.getPrivilege(req.body.uid).then((privs) => {
          cResponse.ok(res, privs)
        }).catch((error) => {
          cResponse.fail(res, error.message, error.code)

        })
      })
    router.route('/role/all')
      .get(guard.protect, (req, res, next) => {
        return authHandler.getAllRoles().then((privs) => {
          cResponse.ok(res, privs)
        }).catch((error) => {
          cResponse.fail(res, error.message, error.code)

        })
      })
    router.route('/role/:id')
      .put(guard.protect, (req, res, next) => {
        let id = req.params.id
        return authHandler.updateRoleById(id, req.body).then((privs) => {
          cResponse.ok(res, privs)
        }).catch((error) => {
          cResponse.fail(res, error.message, error.code)

        })
      })
    return router;
  }
}

const authRouter = new AuthRouter();
module.exports = authRouter.registerRoutes();