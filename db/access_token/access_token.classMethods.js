'use strict';
const db = require('../../db');
class AccessTokenMethods {
    getClassMethods(model) {
        model.addToken = (token, userId) => {return this.addToken(token, userId)}
        model.removeToken = (userId) => {return this.removeToken(userId)}
        model.validToken = (token) => {return this.validToken(token)}
    }

    async addToken(token, userId) {
        try {
            let data = {
                token,
                userId,
                status: 1,
                created: new Date()
            }
            await db.access_tokens.create(data)
            return true
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async removeToken(id) {
        try {
            let accessToken = await db.access_tokens.findOne({where: {userId: id, status: 1}})
            if(accessToken) {
                accessToken.status = 0
                await accessToken.save()
                return true
            }
            return false
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async validToken(token) {
        try {
            let accessToken = await db.access_tokens.findOne({where: {token, status: 1}})
            accessToken = JSON.parse(JSON.stringify(accessToken))
            if(accessToken) {
                return true
            }
            return false
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

module.exports = new AccessTokenMethods();