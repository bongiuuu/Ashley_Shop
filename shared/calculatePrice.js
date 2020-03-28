'use strict'
const _ = require('lodash')
const timeService = require('../shared/timeService');
const constants = require('../shared/constants')
const config = require('config')
const db = require('../db')
const moment = require('moment')
const promoCodeHandler = require('../core/promo_code/promo_code.handler')
class CalculatePrice {
    /**
     * Calculate price
     * @param {datetime} startTime 
     * @param {datetime} endTime 
     * @param {number} priceHour 
     * @param {number} priceDay 
     * @param {number} priceMonth 
     * @param {number} duration not required: number in hours
     */
    getPrice(startTime, endTime, priceHour, priceDay, priceMonth, duration) {
        let month = 0;
        let day = 0;
        let hour = 0;
        let time = duration ? duration : timeService.getHoursBetweenTwoDate(startTime, endTime);
        let totalPrice = 0;
        let price_hour = 0
        if ((time / constants.DAY) < 30) {
            day = _.toInteger(time / constants.DAY);
            hour = time % constants.DAY;
            price_hour = hour * priceHour
            if (price_hour > priceDay) {
                price_hour = priceDay
            }
            totalPrice = day * priceDay + Number(price_hour)
        } else {
            month = _.toInteger(time / constants.MONTH);
            day = _.toInteger((time % constants.MONTH) / constants.DAY);
            hour = (time - (month * constants.MONTH) - (day * constants.DAY));
            totalPrice = month * priceMonth + day * priceDay + hour * priceHour;
        }
        let data = {
            month: month,
            day: day,
            hour: hour,
            total_price: totalPrice
        }
        return data;
    }


    // async getlist(userID) {
    //     let corporate = await db.corporate.findAll({
    //         where: { 'user_id': userID },
    //         attributes: ['status']
    //     })
    //     return corporate
    // }

    //     getlist(userID) {
    //         let sql = `SELECT e.status,co.discount FROM gocar.employee as e join gocar.corporate as co
    // on e.company_id = co.id
    // where user_id = "${userID}";`
    //         return db.getSequelize().query(sql).then(corporate => {
    //             return corporate
    //         })
    //     }


    // async getlist(userId) {
    //     let corporate = await db.employee.findAll({
    //         where: { user_id: userId },
    //         includes: [{ model: db.corporate }],
    //         attributes:['status','discount']
    //     })
    //     return corporate
    // }
    async calculateBookingPrice(data, duration) {
        try {
            let taxRate = config.price.TAX
            let memberFee = 0 //convert to cent
            let voidMemberFee = false;
            let userId = data.userId
            let credit = 0
            let isHub2Hub = data.isHub2Hub
            let isTax = data.isTax
            duration = duration ? duration : data.duration
            let useGocarCredit = data.useGocarCredit
            let useCoporateCredit = data.useCoporateCredit
            let attributes = ['id', 'buildingId', 'carTypeId']
            let car = await db.cars.findOne({
                where: { id: data.carId }, attributes, include: [
                    {
                        model: db.pricing, attributes: ['hourly', 'daily', 'monthly'], on: {
                            buildingId: db.getSequelize().where(db.getSequelize().literal('cars.building_id'), '=', db.getSequelize().literal('rate.building_id')),
                            carTypeId: db.getSequelize().where(db.getSequelize().literal('cars.carType_id'), '=', db.getSequelize().literal('rate.car_type_id'))
                        }, as: 'rate'
                    }
                ]
            })
            let carPrice = this.getPrice(data.startTime, data.endTime, car.rate.hourly, car.rate.daily, car.rate.monthly, duration)
            let bookingFee = Number(carPrice.total_price) * 100 // convert to cent
            let finalPrice = bookingFee
            // let user = await db.reservations.countUserReservations(userId)
            let noOfReservations = await db.reservations.countUserReservations(userId)
            // let  = await this.getlist(userId)
            if (noOfReservations == 0) {
                if (config.price.VOID_MEMBER_FEE == true) {
                    memberFee = config.price.MEMBER_FEE * 100
                    voidMemberFee = true;
                } else {
                    memberFee = config.price.MEMBER_FEE * 100
                    finalPrice += memberFee

                }
            }

            let hub2hubFee;
            if (isHub2Hub && data.hub2hubId) {
                let h2h = await db.hub2hub.find({
                    attributes: ['h2hFee'],
                    where: {pickup_id: data.buildingId, dropoff_id: data.hub2hubId, car_type_id: car.carTypeId}
                })
                console.log("h2h =============> ", h2h);
                 hub2hubFee = h2h ? h2h.h2hFee : 0

                //hub2hubFee = h2h.h2hFee
                finalPrice += (hub2hubFee * 100) // to cent
            }
            data.totalPrice = finalPrice
            data.buildingId = car.buildingId
            data.daily_rate = car.daily_rate

            let building = await db.buildings.findOne({ where: {id:data.buildingId} });
            console.log("Building =============>" , building.city);


            //BEGIN NOTE: comment out or remove this block code when the coporate is ready
            // let discount = data.promoCode ? await promoCodeHandler.checkValidCode(data) : null
            // if (discount) {
            //     finalPrice = finalPrice - (discount.amount)
            //     discount.amount = Number(discount.amount / 100).toFixed(2)
            // }
            // END NOTE

            //BEGIN: coporate
            let discount = data.promoCode ? await promoCodeHandler.checkValidCode(data) : null
            let discountEmp = await db.employee.getlistDiscount(userId);
            let discountCompany;
            if (discountEmp.length == 0) {
                if (discount) {
                    if(discount.amount > finalPrice) {
                        discount.amount = (finalPrice / 100).toFixed(2)
                        finalPrice = 0
                    } else {
                        finalPrice = finalPrice - (discount.amount)
                        discount.amount = Number(discount.amount / 100).toFixed(2)
                    }
                }
            } else {
                let discountPercent = discountEmp[0].corporate.discount;
                let discountAmount = Number((discountPercent * finalPrice) / 100)
                finalPrice = finalPrice - discountAmount
                discountCompany = {
                    discountType: "%",
                    discountRate: '12',
                    discount: (discountAmount / 100).toFixed(2)
                }
            }
            // END: Coporate
            let tax;
            if(building.city != 'Langkawi'){
                tax = this.calculateTax(finalPrice)
                finalPrice = tax.finalPrice
            }else{
                taxRate = 0;
            }
            
            
            let creditRefund = 0
            if (useGocarCredit) {
                let myWallet = await db.wallet.findOne({ include: [{ model: db.users, where: { id: userId } }] })
                credit = myWallet.credit || 0 //credit in cent
                if (credit > finalPrice) {
                    creditRefund = Number(credit - finalPrice).toFixed(0)
                    finalPrice = 0
                } else {
                    finalPrice = finalPrice - credit
                }
            }
            let copWallet
            if (useCoporateCredit) {
                let employee = await db.employee.findOne({ where: { user_id: userId, status: constants.EMPLOYEE_STATUS.APPROVED } })
                employee = JSON.parse(JSON.stringify(employee))
                if (employee && employee.maxCreditCanUse > employee.creditUsed) {
                    let coporateWallet = await db.coporateWallet.findOne(
                        { where: { coporateId: employee.company_id }
                    })
                    let creditUsed = await db.coporateWalletTransaction.getMaxUsage({userId, coporateId: employee.company_id});
                    creditUsed = Number(creditUsed)
                    let coporateCredit = Number(coporateWallet.credit) || 0
                    let remainingCredit = Number(employee.maxCreditCanUse) > creditUsed ? Number(employee.maxCreditCanUse) - creditUsed : 0
                    let creditCanUse = coporateCredit > remainingCredit ? remainingCredit : remainingCredit - coporateCredit
                    let fund;
                    if(creditCanUse > finalPrice) {
                        fund = finalPrice
                        finalPrice = 0
                    } else {
                        finalPrice = finalPrice - creditCanUse
                        fund = creditCanUse
                    }
                    fund = Number(fund)
                    copWallet = {
                        coporateCredit: (coporateCredit/ 100).toFixed(2),
                        fund: (fund / 100).toFixed(2),
                        maxCredit: (employee.maxCreditCanUse / 100).toFixed(2),
                        creditUsed: ((creditUsed + fund) / 100).toFixed(2)
                    }
                }

            }
            let wallet = useGocarCredit ? {
                creditRefund: Number(creditRefund / 100).toFixed(2),
                creditUsed: Number((credit - creditRefund) / 100).toFixed(2),
                total: credit
            } : null
            return {
                tax: {
                    amount: tax ? Number(tax.amount / 100).toFixed(2) : 0,
                    rate: taxRate
                },
                wallet,
                copWallet,
                memberFee: (Number(memberFee) / 100).toFixed(2),
                voidMemberFee: voidMemberFee,

                discount: discountEmp.length !== 0 ? discountCompany : discount, // for coporate, now it's not ready
                // discount: discount, // for non-coporate remove it when we use coporate
                bookingFee: (Number(bookingFee) / 100).toFixed(2),
                finalPrice: (Number(finalPrice) / 100).toFixed(2),

                hub2hub: isHub2Hub ? { rate: hub2hubFee } : null
            }
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    async calculateChangeBookingPrice(body) {
        let carId = body.carId
        let userId = body.userId;
        let buildingId = body.buildingId
        let oldStartTime = body.oldStartTime
        let oldEndTime = body.oldEndTime
        let startTime = moment(body.startTime).format('YYYY-MM-DD HH:00')
        let endTime = moment(body.endTime).format('YYYY-MM-DD HH:00')
        let data1 = {
            carId,
            userId,
            startTime: oldStartTime,
            endTime: oldEndTime,
            duration: null,
            isTax: false,
            buildingId,
        }

        let data2 = {
            carId,
            userId,
            startTime: startTime,
            endTime: endTime,
            duration: null,
            isTax: false,
            buildingId,
        }
        let previousPrice = await this.calculateBookingPrice(data1)
        let currentPrice = await this.calculateBookingPrice(data2)
        let totalPay = 0, bookingFee = 0
        let tax = 0;
        if (Number(previousPrice.finalPrice) < Number(currentPrice.finalPrice)) {
            bookingFee = currentPrice.finalPrice - previousPrice.finalPrice
            tax = this.calculateTax(bookingFee)
            totalPay = tax.finalPrice
        }
        return {
            bookingFee,
            finalPrice: totalPay,
            tax
        }
    }

    /**
     * Calculate the tax base on tax rate and amount
     * @param {number} data the amount need to calculate tax
     */
    calculateTax(data) {
        let taxRate = config.price.TAX
        let tax = Number((data * (taxRate / 100))).toFixed(2)
        let finalPrice = Number(data) + Number(tax);
        return {
            rate: Number(taxRate),
            amount: tax,
            finalPrice: finalPrice.toFixed(2)
        }
    }


}

module.exports = new CalculatePrice();