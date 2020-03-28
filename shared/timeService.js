const moment = require('moment-timezone');
const constants = require('./constants')
const _ = require('lodash')
const timeZone = 'Asia/Kuala_Lumpur'

class TimeService {
    getTimeFromTimeFormat(time, format) {
        return moment(time, format);
    }
    getTimeFromTimeFormatUtc(time, format) {
        return moment(time, format).utc();
    }

    checkTime(startTimeTime1, endTimeTime1, startTimeTime2, endTimeTime2) { }

    compareTwoDate(date1, date2) {
        return this.getTimeFromTimeFormat(date1, constants.DATE_TIME_FORMAT) - this.getTimeFromTimeFormat(date2, constants.DATE_TIME_FORMAT)
    }

    getHoursBetweenTwoDate(startTime, endTime) {
        if (!startTime || !endTime) {
            return 0;
        }
        let a = this.getTimeFromTimeFormat(endTime, constants.DATE_TIME_FORMAT);
        let b = this.getTimeFromTimeFormat(startTime, constants.DATE_TIME_FORMAT);
        return a.diff(b, 'hours');
    }

    getDaysBetweenTwoDate(startTime, endTime) {
        if (!startTime || !endTime) {
            return 0;
        }
        let a = this.getTimeFromTimeFormat(endTime, constants.DATE_TIME_FORMAT);
        let b = this.getTimeFromTimeFormat(startTime, constants.DATE_TIME_FORMAT);
        return a.diff(b, 'days');
    }

    getMonthsBetweenTwoDate(startTime, endTime) {
        if (!startTime || !endTime) {
            return 0;
        }
        let a = this.getTimeFromTimeFormat(endTime, constants.DATE_TIME_FORMAT);
        let b = this.getTimeFromTimeFormat(startTime, constants.DATE_TIME_FORMAT);
        return a.diff(b, 'month');
    }

    toTimeString(time) {

    }

    getNow() {
        return moment().minute(0).second(0).millisecond(0)
    }

    validateTimeRange(timeStart, timeEnd) {
        return new Promise((resolve, reject) => {
            let startTime = moment(timeStart)
            let endTime = moment(timeEnd)
            if (!startTime.isValid() || !endTime.isValid()) throw new Error('Invalid date')
            if (startTime.isAfter(endTime)) throw new Error('Start Time must be less than End Time')
            //if (startTime.isBefore(this.getNow())) throw new Error('Start Time is invalid')
            return resolve(true)
        })
    }

    diffDates(startDate, endDate, hours) {
        if(!hours) {
            hours = this.getHoursBetweenTwoDate(startDate, endDate)
        }
        let hour, day, month
        if ((hours / CONSTANTS.DAY) < 30) {
            day = _.toInteger(hours / CONSTANTS.DAY);
            hour = hours % CONSTANTS.DAY;
        } else if ((hours / CONSTANTS.DAY) == 30) {
            month = _.toInteger(hours / CONSTANTS.MONTH);
            day = _.toInteger((hours % CONSTANTS.MONTH) / CONSTANTS.DAY);
            hour = (hours - (month * CONSTANTS.MONTH) - (day * CONSTANTS.DAY));
        }
        return {
            hour, day, month
        }
    }
    convertToDateWithTimeZone(date) {
        if (date) {
          return moment.tz(date, timeZone).format('YYYY-MM-DD')
        }
      }
}

module.exports = new TimeService();