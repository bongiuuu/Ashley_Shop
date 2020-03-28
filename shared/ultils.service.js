const moment = require('moment')
const constants = require('./constants')
const priceService = require('./calculatePrice')
const _ = require('lodash')
const db = require('../db')

class UtilsService {
    async getUserOwner(uid) {
        let user = await db.users.findOne({ where: { id: uid }, attributes: ['owner'] })
        return user.owner || ''
    }

    getSubQuery(startTime, endTime) {
        // let now = moment().minutes(0).seconds(0).format(constants.DATE_TIME_FORMAT).toString()
        // console.log('now', now)
        return `(SELECT count(id)
        FROM reservations_view reservation
        WHERE cars_view.carTypeId = reservation.car_type_id
          AND cars_view.building_id = reservation.building_id
          AND ((reservation.hub2hubId is not null
          AND reservation.car_return_time is null 
          AND reservation.start_time_incl_buff <= '${endTime}') OR (
             reservation.end_time_incl_buff > now()
          AND not(reservation.start_time_incl_buff > '${endTime}'
                  OR reservation.end_time_incl_buff < '${startTime}')
          )))`
    }

    getSubQueryExtend(startTime, endTime, reservationId) {
        // let now = moment().minutes(0).seconds(0).format(constants.DATE_TIME_FORMAT).toString()
        // console.log('now', now)
        return `(SELECT count(id)
        FROM reservations_view reservation
        WHERE cars_view.id = reservation.car_id
          AND cars_view.building_id = reservation.building_id
          AND reservation.id != '${reservationId}'
          AND ((reservation.hub2hubId is not null
          AND reservation.car_return_time is null 
          AND reservation.start_time_incl_buff <= '${endTime}') OR (
             reservation.end_time_incl_buff > now()
          AND not(reservation.start_time_incl_buff > '${endTime}'
                  OR reservation.end_time_incl_buff < '${startTime}')
          )))`
    }

    getSubQueryBuilding(startTime, endTime) {
        return `(SELECT count(id)
        FROM reservations_active reservation
        WHERE cars_view.building_id = reservation.building_id
        AND ((reservation.dropoff is not null
        AND DATE_SUB(reservation.start_time, INTERVAL 1 hour) <= '${endTime}') OR (
        Date_add(reservation.end_time, interval 1 hour) > now()
        AND not(DATE_SUB(reservation.start_time, INTERVAL 1 hour) > '${endTime}'
        OR DATE_ADD(reservation.end_time, INTERVAL 1 hour) < '${startTime}')
        )))`
    }

    getSubQueryPickCar(startTime, endTime) {
        return `(SELECT count(id)
        FROM reservations_view reservation
        WHERE cars_view.id = reservation.car_id
        AND cars_view.carTypeId = reservation.car_type_id
        AND cars_view.building_id = reservation.building_id
        AND
        ((reservation.hub2hubId is not null
        AND reservation.car_return_time is null 
        AND reservation.start_time_incl_buff <= '${endTime}') OR (
        reservation.end_time_incl_buff > now()
        AND not(reservation.start_time_incl_buff > '${endTime}'
        OR reservation.end_time_incl_buff < '${startTime}')
        )))`
    }

    createUniqueString(len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }
    /**
     * Get distance from point to point by kilometers
     * @param point1 lat: number, lng: number
     * @param point2 lat: number, lng: number
     */
    getDistanceFromPointToPoint(point1, point2) {
        var lat = [point1.lat, point2.lat]
        var lng = [point1.lng, point2.lng]
        var R = 6378137;
        var dLat = (lat[1] - lat[0]) * Math.PI / 180;
        var dLng = (lng[1] - lng[0]) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return Math.round(d).toFixed(2);
    }

    isCanChangeReservation(data) {
        if (data.inspection_time) return false
        let now = moment()
        let isAfter = moment(data.start_time).isAfter(now)
        let diff = moment(data.start_time).diff(now)
        let duration = moment.duration(diff).asMinutes()
        return isAfter && duration > 15 //15min
    }

    isCanStart(data) {
        //console.log("====== >in isCanStart Duration");

        let now = moment()
        let isAfter = moment(data.start_time).isAfter(now)
        if (!isAfter) return true
        let diff = moment(data.start_time).diff(now)
        let duration = moment.duration(diff).asMinutes()
        //console.log("isCanStart Duration ====>" , duration);
        return duration <= 10 //10 min
    }

    isExpired(data) {
        let timeEnd = moment(data.end_time)
        let now = moment()
        return timeEnd.isBefore(now)
    }

    isExpiredExtend(data) {
        let now = moment();
        let overTime = now.diff(moment(data.end_time))
        let duration = moment.duration(overTime).asHours()
        return duration <= 5
    }
    initExtendTime(time, priceHour, priceDay, priceMonth) {
        let timeExtends = [];
        let i;
        for (i = 1; i <= time; i++) {
            let month = 0;
            let day = 0;
            let hour = 0;
            let totalPrice = 0;
            if ((i / constants.DAY) < 30) {
                day = _.toInteger(i / constants.DAY);
                hour = i % constants.DAY;
                // totalPrice = day * priceDay + hour * priceHour;
            } else if ((i / constants.DAY) == 30) {
                month = _.toInteger(i / constants.MONTH);
                day = _.toInteger((i % constants.MONTH) / constants.DAY);
                hour = (i - (month * constants.MONTH) - (day * constants.DAY));
                // totalPrice = month * priceMonth + day * priceDay + hour * priceHour;

            }
            let price = priceService.getPrice(null, null, priceHour, priceDay, priceMonth, i)
            totalPrice = price.total_price
            let title = ' + ';
            if (month != 0) {
                if (month > 1) {
                    title += month + ' Months '
                } else {
                    title += month + ' Month '
                }
            }
            if (day != 0) {
                if (day > 1) {
                    title += day + ' Days '
                } else {
                    title += day + ' Day '
                }
            }
            if (hour != 0) {
                if (hour > 1) {
                    title += hour + ' Hours '
                } else {
                    title += hour + ' Hour '
                }
            }
            title += ' - ' + 'RM' + totalPrice.toFixed(2)
            let data = {
                title: title,
                value: i,
                status: 0,
                total_price: totalPrice
            }
            timeExtends.push(data)
        }
        return timeExtends;
    }

    formatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }
}

module.exports = new UtilsService()