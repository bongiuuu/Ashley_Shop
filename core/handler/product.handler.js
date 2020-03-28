'use strict';

const db = require('../../db')
const Op  = require('sequelize')
const moment = require('moment')
const _ = require('lodash')




class ProductHandler {

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

      let products = await db.product.findAndCountAll(options)
      let total = products.rows.length
      let pages = Math.ceil(total / limit);

      return {
        limit: limit,
        total: total,
        pages,
        products: products.rows
    }
  
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async uploadProducImage(){
    
  }

  async add(req) {

    if (Object.keys(req.body).length === 0) {
      return "Body can not be Empty"
    }

    const product = req.body
    const category = await db.category.findOne({where : { "id": product.categoryId }})

    if(!category) {
      return "Category not exist"
    }

    let t = await db.sequelize.transaction()
    try {
      let productDB = await db.product.create(product,{transaction : t})
      t.commit()
      return productDB
    } catch (error) {
      t.rollback()
      console.log(error)
      throw error
    }
  }

  async upload(req) { 

     // Check for registration messages
  const userEmail = req.body.userEmail;
  const userName = req.body.userName;
  const userMobile = req.body.userMobile;
  const password = req.body.password;

  // 1. Check madatory field
  let messages = [];
  if (!userEmail) {
    messages.push(messagesList.registerNewUser.emailRequired);
  }
  if (!userMobile) {
    messages.push(messagesList.registerNewUser.mobileRequired);
  }
  if (!password) {
    messages.push(messagesList.registerNewUser.passwordRequired);
  }
  if (messages.length > 0) {
    res.json({ code: 1, message: messages.join('\n') });
    return;
  }

  //  2. Check validate filed.
  if (!validator.isEmail(userEmail.toString())) {
    messages.push(messagesList.registerNewUser.incorrectEmail)
  }
  if (!helper.checkPatternMobile(userMobile.toString())) {
    messages.push(messagesList.registerNewUser.incorrectMobile)
  }
  if (!helper.checkPassword(password.toString())) {
    messages.push(messagesList.registerNewUser.incorrectPass)
  }
  if (messages.length > 0) {
    res.json({ code: 1, message: messages.join('\n') });
    return;
  }

  //check existing user with mobile or email
  // let condition = { where: { $or: [{ userEmail: userEmail.toString().trim(), userMobile: userMobile.toString().trim() }] } };
  let condition = { where: { $or: [{ userEmail: userEmail.toString().trim() }, { userMobile: helper.getNumberMobile(userMobile.toString().trim()) }] } };
  models.UserMobile.findOne(condition).then(function (result) {
    if (result) {
      res.json({ code: 1, message: messagesList.registerNewUser.existingUser });
    } else {
      let user = {};
      user.name = userName.toString().trim();
      user.email = userEmail.toString().trim();
      user.mobile = helper.getNumberMobile(userMobile.toString().trim());
      user.password = passwordHash.generate(password.toString().trim());
      user.activated = config.activateUserMobile;

      let userSystem = {
        userName: user.name, userEmail: user.email, userMobile: user.mobile,
        password: user.password, activated: user.activated
      };
      models.UserMobile.create(userSystem).then(function (newUser) {
        user.id = newUser.id;
        delete user.password;
        const userInfo = helper.setUserInfoSystem(user);
        const tocken = `JWT ${helper.generateToken(userInfo)}`;       
        res.json({ code: 0, message: messagesList.registerNewUser.registerSuccess, access_token: tocken, user: user, activated: user.activated });
      }).catch(function (ex) {
        res.json({ code: 1, message: messagesList.registerNewUser.registerError });
      });
    }
  });

  }

  async updateUser(req) {  

    try {
      //check validate
      let messages = [];
      if (req.body.email != undefined && req.body.email.toString().trim() === '') {
        messages.push(messagesList.changeAccount.emailRequired);
      }
      if (req.body.mobile != undefined && req.body.mobile.toString().trim() === '') {
        messages.push(messagesList.changeAccount.mobileRequired);
      }
      if (req.body.email && !validator.isEmail(req.body.email)) {
        messages.push(messagesList.changeAccount.incorrectEmail);
      }
      if (req.body.mobile && !helper.checkPatternMobile(req.body.mobile)) {
        messages.push(messagesList.changeAccount.incorrectMobile);
      }
      if (req.body.newPassword != undefined && !helper.checkPassword(req.body.newPassword)) {
        messages.push(messagesList.changeAccount.incorrectNewPass);
      }
      else {
        if (req.body.confirmPassword != undefined && !helper.checkPassword(req.body.confirmPassword)) {
          messages.push(messagesList.changeAccount.incorrectConfirmPass);
        }
        else {
          if (req.body.confirmPassword != undefined && req.body.newPassword == undefined) {
            messages.push(messagesList.changeAccount.newPassRequired);
          }
          else {
            if (req.body.confirmPassword == undefined && req.body.newPassword != undefined) {
              messages.push(messagesList.changeAccount.confirmPassRequired);
            }
            else
              if (req.body.newPassword && req.body.confirmPassword && req.body.confirmPassword !== req.body.newPassword) {
                messages.push(messagesList.changeAccount.notMatchPass);
              }
          }
        }
      }
      if (messages.length > 0) {
        res.json({ code: 1, message: messages.join('\n') });
        return;
      }
      let filePath = null;
      if (req.file) {
        filePath = req.file.path;
      }
      let userUpdate = {};
      // if (req.body.email)
      //   userUpdate.email = req.body.email;
      if (req.body.name)
        userUpdate.name = req.body.name;
      if (req.body.mobile)
        userUpdate.mobile = helper.getNumberMobile(req.body.mobile);
      if (req.body.newPassword)
        userUpdate.password = passwordHash.generate(req.body.newPassword);
      if (filePath)
        userUpdate.avatar = filePath;
      const id = req.user.id;
  
  
 
      models.UserMobile.findById(id).then(function (user) {
        if (!_.isEmpty(userUpdate)) {
          user.updateAttributes(userUpdate).then(function (result) {
            {
              res.json({ code: 0, message: messagesList.changeAccount.success, avatar: config.IMAGE_SERVER.URL_IMAGES + result.avatar });
            }
          });
        } else {
          res.json({ code: 0, message: messagesList.changeAccount.success, avatar: null });
        }
      }).catch(function (ex) {
        res.json({ code: 1, message: messagesList.changeAccount.error });
      })
    }
    catch (ex) {
      res.json({ code: 1, message: messagesList.changeAccount.error });
    }
  }

}

module.exports = new ProductHandler()