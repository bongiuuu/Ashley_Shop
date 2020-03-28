const db = require('../../db')
// const moment = require('moment')
const _ = require('lodash')



class CartHandler {

  async getCartById(cartId) {

    let options = {}
    options.where = { id: cartId }
    options.include = [
      {
        model: db.cartItem,
        as: 'cartItem',
        include: {
          model: db.product,
          as: 'product'
        }
      }
    ]

    try {
      let cart = await db.cart.findOne(options)
      if (!cart) {
        return "The cart is not exist."
      }

      return cart
    } catch (error) {
      console.log(error)
      throw error
    }

  }

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
      toDate = moment.tz(toDate + ' 23:59', 'Asia/Ho_Chi_Minh')
      conditions.createdDate = { $lte: toDate }
    } else if (fromDate && toDate) {
      fromDate = moment.tz(fromDate + ' 00:00', 'Asia/Ho_Chi_Minh')
      toDate = moment.tz(toDate + ' 23:59', 'Asia/Ho_Chi_Minh')
      conditions.createdDate = { $and: [{ $gte: fromDate }, { $lte: toDate }] }
    }

    options.where = {
      isDeleted: 0,
      ...conditions
    }

    if (key) {
      let $or = [
        { nameVn: { $like: `%${key}%` } },
        { nameEn: { $like: `%${key}%` } }
      ]
      options.where.$or = $or
    }

    options.offset = offset
    options.limit = limit
    options.subQuery = false
    options.order = [['priority', 'desc']]
    options.include = [{
      model: db.cartItem, as: 'cartItem',
      include: [{ model: db.product, as: "product" }],
    }]

    try {
      let carts = await db.cart.findAndCountAll(options)
      let total = carts.rows.length
      let pages = Math.ceil(total / limit);

      return {
        limit: limit,
        total: total,
        pages,
        carts: carts.rows
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async add(req) {

    let { cartItem, ...cart } = req.body;

    if (Object.keys(cart).length === 0) {
      return "Body can not be Empty"
    }

    if (!Array.isArray(cartItem)) {
      return "CartItem can not be Empty"
    }

    let t = await db.sequelize.transaction()

    try {
      let cartDb = await db.cart.create(cart, { transaction: t })

      const cartId = cartDb.id
      const promises = [];
      cartItem.forEach(item => {
        item.cartId = cartId
        promises.push(db.cartItem.create(item, { transaction: t }))
      });

      await Promise.all(promises);
      t.commit()
      return cart
    } catch (error) {
      t.rollback()
      console.log(error)
      throw error
    }
  }

  async update(req) {

    // Update Cart 
    // 1 Remove all CartItem
    // 2 Add New CartItem 
    let { cartItem, ...cart } = req.body;

    if (Object.keys(cart).length === 0) {
      return "Body can not be Empty"
    }

    if (!Array.isArray(cartItem)) {
      return "CartItem can not be Empty"
    }

    if (!cart.id) {
      return "Id can not be null"
    }

    let cartDb = await db.cart.findOne({
      where: { id: cart.id },
      include: [{
        model: db.cartItem,
        as: 'cartItem'
      }]
    })

    if (!cartDb) {
      return "Cart not be exist"
    }

    if (!Array.isArray(cartDb.cartItem)) {
      return "cartItem in cart Db can not be Empty"
    }

    let t = await db.sequelize.transaction()
    try {
      const cartId = cartDb.id
      const promises = [];

      // Remove All cartItem
      cartDb.cartItem.forEach(item => {
        promises.push(db.cartItem.destroy(
          {
            where: {
              id: item.id
            },
            truncate: false,
            t
          }
        ));
      });

      // Update Cart information
      // delete cart.id
      promises.push(db.cart.update(cart, { where : { id : cartId}, transaction: t }))

      // Create cartItem 
       cartItem.forEach(item => {
        item.cartId = cartId
        promises.push(db.cartItem.create(item, { transaction: t }))
       }) 

      await Promise.all(promises);
      t.commit()
      return cart
    } catch (error) {
      t.rollback()
      console.log(error)
      throw error
    }

  }

}

module.exports = new CartHandler()