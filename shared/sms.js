const _ = require('lodash')
const config = require('config');
const request = require('request-promise')
var urlencode = require('urlencode');
var plivo = require('plivo');
class SMS {
    send(phone, sms) {
        if (_.slice(phone, 0, 1) == '6') {
            phone = '+' + phone;
        }
        if (_.slice(phone, 0, 1) == '0') {
            phone = '+6' + phone;
        }
        if (config.SMS.gateway == 'plivo') {

            let endcodeSms = urlencode(sms)
            let client = new plivo.Client('MAMWM5MGQ2ZDZMYJMYOW', 'NmRjYzBmNDc4NzQ2NGE4M2U5ZDk4YjIzNmYxMzMy');

            client.messages.create(
                "60340475231", // src
                phone, // dst
                sms, // text
            ).then(response => {
                console.log("plivo resonse : ", response);
                return
            }, function (err) {
                console.error(err)
                return
            });

        } else if (config.SMS.gateway == 'nexmo') {
            let qs = {
                api_key: 'f502631c',
                api_secret: 'a3613cb71de6fdc3',
                from: '441632960960',
                to: phone,
                text: sms
            }
            return request({
                url: config.urlNexmo,
                qs: qs
            }).then(res => {
                console.log("nexmo response : ", res);
            })

        } else if (config.SMS.gateway == 'macrokiosk') {
            return request({
                //url: config.bulksms,
                url: `http://www.etracker.cc/bulksms/mesapi.aspx?user=gocar2&pass=%27PuBB271&type=0&to=${phone}&from=gocar&text=${sms}&servid=MES01&title=GoCar`
            }).then(res => {
                console.log("macrokiosk response : ", res);
            })
        } else if (config.SMS.gateway == 'twilio') {
            const accountSid = 'ACf054d6cad6124b608781970b63711818';
            const authToken = 'adac09ce6a9777b4b20f47d9470fc3d9';
            const client = require('twilio')(accountSid, authToken);
            client.messages.create({
                from: '+17036594973',
                to: phone,
                body: sms
            }).then((message) => {
                console.log("Twillio Response : ", message)
            }).catch((err) => {
                console.log('send sms fail, ', err)
            })
        } else {
            return request({
                //url: config.bulksms,
                url: `http://www.etracker.cc/bulksms/mesapi.aspx?user=gocar2&pass=%27PuBB271&type=0&to=${phone}&from=gocar&text=${sms}&servid=MES01&title=GoCar`
            }).then(res => {
                console.log("macrokiosk response : ", res);
            })
        }
    }


}

module.exports = new SMS();