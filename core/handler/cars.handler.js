const db = require('../../db')
// const moment = require('moment')
const _ = require('lodash')



class CarsHandler {
  async listAll(query) {
    try {
      let cars = await db.cars.findAll({
        attributes: ['id', 'model'],
      })
      return cars
    } catch (error) {
      console.log(error)
      throw error
    }
  }


 
}

module.exports = new CarsHandler()