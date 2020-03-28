
const db = require('../../db')
// const moment = require('moment')
const _ = require('lodash')
const secure = require('../../shared/secure')

class UserHandler {
  async listAll(query) {
    try {
      let options = {}
      options.include = []

      // options.attributes = ['id','name']

      // options.include.push(
      //   { model: db.cars, as: 'cars' }
      // )

      let users = await db.user.findAll(options)
      return users
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async getUserById(req) {

    const id = req.params.id
    let options = {}
    options.where = { id : id }
    // options.include = [
    //   {
    //     model : db.cars,
    //     as : 'cars'
    //   }
    // ]
    
    try {
      let user = await db.user.findOne(options)
      if(!user){
        return "The user is not exist."
      }
      
      return user
    }catch (error) {
      console.log(error)
      throw error
    }
  }

  async add(req,res) {

    if (Object.keys(req.body).length === 0) {
      throw new Error('Body can not be Empty!')
    }

    const user = req.body
    let checkUser = await db.user.findOne({where : { username : user.username}})

    if(checkUser){
      throw new Error('Account exist!')
    }

    if(user.role != 'admin' && user.role != 'user'){
      throw new Error('Check Role!')
    }

    user.password = secure.generatePwd(user.password)
    let t = await db.sequelize.transaction()
    try {
      let userDB = await db.user.create(user,{transaction : t})
      delete userDB.password;
      t.commit()
      return userDB
    } catch (error) {
      t.rollback()
      console.log(error)
      throw error
    }
  }

  async update(req) {

    if (Object.keys(req.body).length === 0) {
      return "body can not be Empty"
    }

    const user = req.body

    let isUser = db.user.findOne({where : {id : user.id}})

    if(!isUser){
      return "The user is not exist."
    }


    let t = await db.sequelize.transaction()
    try {

      let userDB = await db.user.update(user, {where : {id:user.id}},{transaction : t})

      if(Array.isArray(user.cars)){
        user.cars.forEach(car => {
          db.cars.update(car, {where : {id:car.id}},{transaction : t})
        });
      }

      t.commit()
      return userDB
    } catch (error) {
      t.rollback()
      console.log(error)
      throw error
    }
  }



}

module.exports = new UserHandler()