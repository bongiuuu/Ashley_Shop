const db = require('../../db')
const secure = require('../../shared/secure')
const jwtHelper = require('../../shared/jwt')
const constants = require('../../shared/constants')
const _ = require('lodash')
const httpCode = require('../../response/status-code')
class Auth {
  async login(username, password) {
    try {
      let hashedPassword = secure.generatePwd(password)
      let users = await db.user.findAll({ attributes: ['id', 'role', 'fullName','email','telephone'], where: { username: username, password: hashedPassword } })
      users = JSON.parse(JSON.stringify(users))
      if (users.length <= 0) {
        throw new Error('Email or password is not valid!')
      }
      let user = _.find(users, (user) => {
        return true
      })
      // let userPending = _.find(users, (user) => {
      //   return user.isVerified == constants.USER_STATUS.PENDING && user.isBlock != constants.USER_STATUS.BLOCK
      // })
      // let userBlocked = _.find(users, (user) => {
      //   return user.isBlock == constants.USER_STATUS.BLOCK
      // })
      // let user
      // if (userApproved) {
      //   user = userApproved
      // } else if (userPending) {
      //   user = userPending
      // } else if (userBlocked) {
      //   let message = 'User has been blocked.'
      //   let code = httpCode.FOR_BIDDEN
      //   throw { message, code }
      // }

      let u = {
        id: user.id,
        fullName: user.fullName,
        role: user.role
      }
      let token = jwtHelper.generateToken(u)
      u.email =  user.email,
      u.telephone =  user.telephone
      u.token = token
      // u.isBlock = user.isBlock
      // u.isVerified = user.isVerified
      await db.access_tokens.addToken(token, user.id)
      return u
    } catch (error) {
      throw error
    }
  }

  async logout(token) {
    try {
      await db.access_tokens.removeToken(token)
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getPrivilege(uid) {
    try {
      let user = await db.users.findOne({ attributes: ['role'], where: { id: uid } })
      let privileges = await db.role_acesses.findAll({ where: { role: user.role } })
      return privileges
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getAllRoles() {
    try {
      let roles = await db.role_acesses.findAll()
      return roles
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateRoleById(id, data) {
    try {
      let permisstion = await db.role_acesses.findOne({ where: { id: id } })
      if (permisstion) {
        permisstion.read = data.read
        permisstion.write = data.write
        await permisstion.save()
        return true
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = new Auth()