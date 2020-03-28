const constants = require('../shared/constants')
const db = require('../db')
var request = require('request');
const transform = require('camaro')
var policies = require('../policies/ipay88.policies')
const signature = require('./signature');
const crypto = require('crypto');

class ipay88 {

    async pay(order) {
        try {
            if (!order.refNo)
                order.refNo = crypto.randomBytes(8).toString('hex');
            if (!order.currency)
                order.currency = 'MYR';

            let isOrderValid = await policies.validateOrder(order);
            if (isOrderValid) {
                order.signature = await signature.signatureSCnoOTP(order.refNo, order.tokenId, order.amount, order.currency, order.xfield1);
                let result = await this.charge(order);
                let insert = await db.ipay88Transactions.add(result);

                if (result.errDesc == '') {
                    return result
                } else {
                    throw new Error(result.errDesc)
                }
            } else {
                throw new Error('Server error')
            }
        } catch (error) {
            throw Error(error)
        }
    }


    charge(data) {
        return new Promise(async (resolve, reject) => {
            var url = 'https://www.mobile88.com/epayment/webservice/MHGatewayService/GatewayService.svc?wsdl';

            let xml2 = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mob="https://www.mobile88.com" xmlns:mhp="http://schemas.datacontract.org/2004/07/MHPHGatewayService.Model">' +
                '<soapenv:Header/>' +
                '<soapenv:Body>' +
                '<mob:EntryPageFunctionality>' +
                '<mob:requestModelObj>' +
                '<mhp:ActionType>SC</mhp:ActionType>' +
                '<mhp:Amount>' + data.amount + '</mhp:Amount>' +
                '<mhp:Currency>' + data.currency + '</mhp:Currency>' +
                '<mhp:MerchantCode>' + constants.MERCHANTCODE_BC + '</mhp:MerchantCode>' +
                '<mhp:PaymentId>2</mhp:PaymentId>' +
                '<mhp:ProdDesc>' + data.productDesc + '</mhp:ProdDesc>' +
                '<mhp:RefNo>' + data.refNo + '</mhp:RefNo>' +
                '<mhp:Signature>' + data.signature + '</mhp:Signature>' +
                '<mhp:SignatureType>SHA256</mhp:SignatureType>' +
                '<mhp:TokenId>' + data.tokenId + '</mhp:TokenId>' +
                '<mhp:UserContact>' + data.contact + '</mhp:UserContact>' +
                '<mhp:UserEmail>' + data.email + '</mhp:UserEmail>' +
                '<mhp:UserName>' + data.name + '</mhp:UserName>' +
                '<mhp:lang>UTF-8</mhp:lang>' +
                '<mhp:xfield1>' + data.xfield1 + '</mhp:xfield1>' +
                '</mob:requestModelObj>' +
                '</mob:EntryPageFunctionality>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';

            var options = {
                url: url,
                method: 'POST',
                body: xml2,
                headers: {
                    'Content-Type': 'text/xml;charset=utf-8',
                    'Accept-Encoding': 'gzip,deflate',
                    'Content-Length': xml2.length,
                    'SOAPAction': "https://www.mobile88.com/IGatewayService/EntryPageFunctionality"
                }
            };

            let callback = (error, response, body) => {

               // console.log(body);

                if (!error && response.statusCode == 200) {

                    var template = {
                        result: ['s:Envelope/s:Body/EntryPageFunctionalityResponse/EntryPageFunctionalityResult', {
                                actionType: 'a:ActionType',
                                amount: 'a:Amount',
                                authCode: 'a:AuthCode',
                                bankMID: 'a:BankMID',
                                bindCardErrDescc: 'a:BindCardErrDescc',
                                ccName: 'a:CCName',
                                ccNo: 'a:CCNo',
                                currency: 'a:Currency',
                                errDesc: 'a:ErrDesc',
                                paymentId: 'a:PaymentId',
                                paymentType: 'a:PaymentType',
                                refNo: 'a:RefNo',
                                remark: 'a:Remark',
                                requery: 'a:Requery',
                                s_bankname: 'a:S_bankname',
                                s_country: 'a:S_country',
                                signature: 'a:Signature',
                                status: 'a:Status',
                                tokenId: 'a:TokenId',
                                transId: 'a:TransId',
                                xfield1: 'a:Xfield1'
                            }

                        ]


                    }

                    var result = transform(body, template);
                    resolve(result.result[0]);

                };
            };

            request(options, callback);

        })
    }
}

module.exports = new ipay88();