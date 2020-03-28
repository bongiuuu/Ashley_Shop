const sha1 = require('sha1')
const config = require('config')

class Secure {
  generatePwd(plainPwd) {
    return sha1(config.SHA1_KEY + plainPwd);
  }
}

module.exports = new Secure()