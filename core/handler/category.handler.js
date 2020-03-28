const db = require('../../db')
// const moment = require('moment')
const _ = require('lodash')



class CategoryHandler {
  async getAll(query) {

    let fromDate = query.fromDate;
    let toDate = query.toDate;
    const conditions = {}
  
    let { limit, page, key, tags } = query
    let options = {}
    let tagsWhere = {}
    options.where = {}
    limit = limit ? Number(limit) : 3
    page = page ? Number(page) : 0
    let offset = limit * page

    
    if (fromDate && !toDate) {
      conditions.createdDate = { $gte: fromDate } 
    } else if (!fromDate && toDate) {
      toDate =   moment.tz(toDate + ' 23:59', 'Asia/Ho_Chi_Minh')
      conditions.createdDate = { $lte: toDate } 
    } else if (fromDate && toDate) {
      fromDate = moment.tz(fromDate + ' 00:00', 'Asia/Ho_Chi_Minh')
      toDate =   moment.tz(toDate + ' 23:59', 'Asia/Ho_Chi_Minh')
      conditions.createdDate = { $and: [{ $gte: fromDate }, { $lte: toDate }] }
    }
   
    options.where = {
      isDeleted: 0,
      ...conditions
    }

    if (key) {
      let $or = [
          { nameVn: { $like: `%${key}%` } },
          { nameEn: { $like: `%${key}%` } },
          { desVn: { $like: `%${key}%` } },
          { desEn: { $like: `%${key}%` } }
      ]
      options.where.$or = $or
    }

    options.offset = offset
    options.limit = limit
    options.subQuery = false
    options.order = [['priority', 'desc']]

    try {

      let products = await db.category.findAndCountAll(options)
      let total = products.count
      let pages = Math.ceil(total / limit);

      return {
        total: total,
        pages,
        products: products.rows
    }
  
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async add(req) {

    if (Object.keys(req.body).length === 0) {
      return "Body can not be Empty"
    }

    const category = req.body
 
    let t = await db.sequelize.transaction()
    try {
      let categoryDB = await db.category.create(category,{transaction : t})
      t.commit()
      return categoryDB
    } catch (error) {
      t.rollback()
      console.log(error)
      throw error
    }
  }


 
}

module.exports = new CategoryHandler()