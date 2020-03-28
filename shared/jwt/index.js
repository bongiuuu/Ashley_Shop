const jwt = require('jsonwebtoken')
const config = require('config')
class JWTHelper {
  generateToken(user) {
    return jwt.sign(user, config.PRIVATE_KEY, {expiresIn: config.TOKEN_EXPIRESIN})
  }
  
  validateToken(token) {
    if(!token) return false
    let decoded = jwt.verify(token, config.PRIVATE_KEY)
    if(!decoded) {
      return false
    }
    return decoded;
  }
}

module.exports = new JWTHelper()