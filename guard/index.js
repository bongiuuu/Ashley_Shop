const jwtHelper = require('../shared/jwt')
const config = require('config')
const db = require('../db')
const httpCode = require('../response/status-code')
const accessRole = require('../config/access-role')
class Guard {
  async protect(req, res, next) {
    try {
      let token = req.headers[config.TOKEN_KEY]
      let validToken = await db.access_tokens.validToken(token)
      if(!validToken) {
        return res.status(httpCode.UNAUTHORIZED).send()
      }
      let urls = req.url.split('/')
      let decoded = jwtHelper.validateToken(token)
      if (!decoded) return res.status(401).send()
      let id = decoded.id
      req.body['uid'] = id
      req.params['uid'] = id
      req.query['uid'] = id
      let user = await db.user.find({ attributes: ['role'], where: { id: id } })
      user = JSON.parse(JSON.stringify(user))
      if (!user || user.length <= 0) {
        return res.status(httpCode.UNAUTHORIZED).send()
      }
      let role = user['role']
      if (role == 'admin') {
        return next()
      }
      let accessRoutes = accessRole.getAccessableRoles(user.role)
      let accessable = false
      accessRoutes.forEach(element => {
        if (element == urls[0] || element == 'All') {
          accessable = true
        }
      });
      if (accessable) return next()
      return res.status(httpCode.FOR_BIDDEN).send()
    } catch (error) {
      console.error(error)
      if(error.name == 'TokenExpiredError') {
        res.status(httpCode.UNAUTHORIZED).send()
      }
    }
  }
}

module.exports = new Guard()