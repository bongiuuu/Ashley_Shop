const nodemailer = require('nodemailer')
const EmailTemplate = require('email-templates')
let poolConfig = {
  service: 'gmail',
  auth: {
    user: 'hello@gocar.my',
    pass: 'serviceGC123'
  }
};

const transporter = nodemailer.createTransport(poolConfig)

const mailTemplate = new EmailTemplate({
  transport: {
    jsonTransport: true
  },
  views: {
    options: {
      extension: 'ejs'
    }
  },
  htmlToText: false
})

let mailOptions = {
  from: '"GoCar Malaysia" <hello@gocar.my>', // sender address
  to: '', // list of receivers
  subject: '',
  text: '',
  html: ''
};

class Mailer {
  async send(data) {
    try {
      let template = await mailTemplate.render('templates/' + data.type, data)
      mailOptions.subject = data.subject
      mailOptions.html = template
      mailOptions.to = data.to
      transporter.sendMail(mailOptions)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

module.exports = new Mailer()