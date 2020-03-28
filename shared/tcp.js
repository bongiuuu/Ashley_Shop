const _ = require('lodash')
const config = require('config');
const request = require('request-promise')
class TCP {
    unlock(trackerId) {
        let qs = {
            deviceId: trackerId,
            lockStatus: 1,
        }
        console.log("UNLOCK ====> ", config.urlLockUnlock);
        return request({
            method: 'POST',
            url: config.urlLockUnlock,
            qs: qs
        })
    }
    lock(trackerId) {
        let qs = {
            deviceId: trackerId,
            lockStatus: 0,
        }
        console.log("LOCK ====> ", config.urlLockUnlock);

        return request({
            method: 'POST',
            url: config.urlLockUnlock,
            qs: qs
        })
    }

}

module.exports = new TCP();