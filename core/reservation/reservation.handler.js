const db = require('../../db')
// const moment = require('moment')
const _ = require('lodash')



class ReservationHandler {
  async listAll(query) {
    try {
      let cars = await db.cars.findAll({
        attributes: ['id', 'make', 'model', 'registration', 'available', 'owner', 'carTypeId','trackerId'],
      })
      return cars
    } catch (error) {
      console.log(error)
      throw error
    }
  }


 
}

module.exports = new ReservationHandler()