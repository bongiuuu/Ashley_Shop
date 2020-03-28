'use strict';
const cron = require('node-cron');
const dbMongo = require('../dbMongo')
const db = require('../db')
const moment = require('moment-timezone')
const _ = require('lodash')
const logger = require('../shared/winston')

class CronJob {
    startCronJob() {
        // run cron job every hours (15 0-23 * * *)
        var taskEveryHours = cron.schedule('15 0-23 * * *', () => {
            console.log("cron job every hours")
            this.storeBuildingEveryHours()
            this.storeCarEveryHours()
        });
        taskEveryHours.start()

        // run cron job at 23h30 (30 23 * * *)
        var taskEveryDay = cron.schedule('30 23 * * *', () => {
            console.log("cron job every day")
            this.storeBuildingEveryDay()
            this.storeCarEveryDay()
        });
        taskEveryDay.start()
    }

    async storeBuildingEveryHours() {
        let today = moment().format('YYYY-MM-DD HH:mm')
        let startOfHours = moment(today).startOf('hour').format('YYYY-MM-DD HH:mm')
        console.log(today)
        try {
            let buildings = await db.buildings.findAll({
                attributes: ['id', 'name', [db.sequelize.literal('(SELECT count(car.id) FROM cars as car WHERE car.building_id = buildings.id)'), 'countCar']],
                include: [
                    {
                        model: db.cars, as: 'cars', required: true,
                        attributes: ['id',
                            [db.sequelize.literal(`(SELECT count(r.id) FROM reservations as r WHERE cars.id = r.car_id and r.start_time <= '${today}' and r.end_time >= '${today}' and r.isBuffer = 0 and r.admin_block=0)`), 'countReservation']],
                    }
                ]
            })
            buildings = JSON.parse(JSON.stringify(buildings))
            let promise = _.forEach(buildings, async building => {
                try {
                    let count = 0;
                    _.forEach(building.cars, car => {
                        if (car.countReservation > 0) {
                            count = count + car.countReservation
                        }
                    })
                    let data = {
                        buildingId: building.id,
                        buildingName: building.name,
                        dateTime: startOfHours,
                        utilisation: ((count / building.countCar) * 100).toFixed(2)
                    }
                    await dbMongo.utilisationBuilding.create(data)
                } catch (error) {
                    logger.error('error store mongo utilisation building: ' + `(${building.id})` + error.message)
                }
            })
            await Promise.all(promise)
            console.log("success save utilisation building")
        } catch (error) {
            logger.error('error save utilisation building: ' + error.message)
        }
    }

    async storeBuildingEveryDay() {
        let today = moment().format('YYYY-MM-DD')
        let dateStore = moment().format('YYYY-MM-DD HH:mm')
        let startDate = moment.tz(today + ' 00:00', 'Asia/Kuala_Lumpur').utc()
        let endDate = moment.tz(today + ' 23:59', 'Asia/Kuala_Lumpur').utc()
        let ref = dbMongo.utilisationBuilding.find({})
        ref.where("dateTime").gte(startDate).lte(endDate)
        let data = await ref
        let datas = JSON.parse(JSON.stringify(data))
        let groupBuilding = _.groupBy(datas, 'buildingId')
        try {
            let promises = []
            _.forEach(groupBuilding, async buildings => {
                try {
                    let total = 0
                    _.forEach(buildings, element => {
                        total = total + element.utilisation
                    })
                    let data = {
                        buildingId: buildings[0].buildingId,
                        buildingName: buildings[0].buildingName,
                        dateTime: dateStore,
                        utilisation: ((total / buildings.length)).toFixed(2)
                    }
                    let promise = await dbMongo.utilisationBuildingEveryDay.create(data)
                    promises.push(promise)
                } catch (error) {
                    logger.error("error save utilisation building every day: " + error.message)
                }
            })
            await Promise.all(promises)
            console.log("success save utilisation building every day: ")
        } catch (error) {
            logger.error("error save utilisation building every day: " + error.message)
        }
    }

    async storeCarEveryHours() {
        let today = moment().format('YYYY-MM-DD HH:mm')
        let startOfHours = moment(today).startOf('hour').format('YYYY-MM-DD HH:mm')
        console.log(today)
        try {
            let cars = await db.cars.findAll({
                where: { tags: { $ne: 'RETIRED' } },
                attributes: ['id', 'registration', 'buildingId'],
                include: [
                    {
                        model: db.reservations,
                        as: 'booking',
                        required: false,
                        attributes: ['id', 'adminBlock'],
                        where: { $and: [{ startTime: { $lte: today } }, { endTime: { $gte: today } }, { isBuffer: 0 }] }
                    }
                ],
                order: [
                    [{ model: db.reservations, as: 'booking' }, 'adminBlock', 'asc']
                ]
            })
            cars = JSON.parse(JSON.stringify(cars))
            let promise = _.forEach(cars, async car => {
                try {
                    let isBlock = false
                    if (car.buildingId == '53cbde61-66ec-4e2a-834b-5251ae7f5eb2' || car.buildingId == '0fbfe305-dc36-11e5-b3ef-f23c9184383e') {
                        isBlock = true
                    }
                    let data = {
                        carId: car.id,
                        registration: car.registration,
                        dateTime: startOfHours,
                        utilisation: car.booking && car.booking.length > 0 ? ((car.booking[0].adminBlock == 1 || isBlock) ? 0 : 100) : 0,
                        adminBlock: car.booking && car.booking.length > 0 ? ((car.booking[0].adminBlock == 1 || isBlock) ? true : false) : false
                    }
                    await dbMongo.utilisationCar.create(data)
                } catch (error) {
                    logger.error("error save utilisation building: " + `(${car.id})` + error.message)
                }
            })
            await Promise.all(promise)
            console.log("success save utilisation car: ")
        } catch (error) {
            logger.error("error save utilisation building: " + error.message)
        }
    }

    async storeCarEveryDay() {
        let today = moment().format('YYYY-MM-DD')
        let dateStore = moment().format('YYYY-MM-DD HH:mm')
        let startDate = moment.tz(today + ' 00:00', 'Asia/Kuala_Lumpur').utc()
        let endDate = moment.tz(today + ' 23:59', 'Asia/Kuala_Lumpur').utc()
        let ref = dbMongo.utilisationCar.find({})
        ref.where("dateTime").gte(startDate).lte(endDate)
        let data = await ref
        let datas = JSON.parse(JSON.stringify(data))
        let groupCar = _.groupBy(datas, 'carId')
        try {
            let promises = []
            _.forEach(groupCar, async cars => {
                try {
                    let total = 0
                    let adminBlockData = 0
                    _.forEach(cars, element => {
                        total = total + element.utilisation
                        adminBlockData = adminBlockData + (element.adminBlock ? 100 : 0)
                    })
                    let data = {
                        carId: cars[0].carId,
                        registration: cars[0].registration,
                        dateTime: dateStore,
                        utilisation: ((total / cars.length)).toFixed(2),
                        adminBlockData: ((adminBlockData / cars.length)).toFixed(2),
                    }
                    let promise = await dbMongo.utilisationCarEveryDay.create(data)
                    promises.push(promise)
                } catch (error) {
                    logger.error("error save utilisation car every day: " + error.message)
                }
            })
            await Promise.all(promises)
            console.log("success save utilisation car every day: ")
        } catch (error) {
            logger.error("error save utilisation car every day: " + error.message)
        }
    }

}

module.exports = new CronJob
