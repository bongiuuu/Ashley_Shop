'use strict';

const logger = require('../shared/logger')('common:generalErrorHandler');
var crypto = require('crypto');
const constant = require('./constants');

class Signature{

    signatureSC(refNo , tokenId , amount , currency,xfield1){
        amount = amount.replace('.','').replace(',','');
        let data = refNo+tokenId+amount+currency+xfield1;
        data = constant.MERCHANTKEY+constant.MERCHANTCODE+data;
        console.log(data);
        return this.generate(data);
    }

    signatureSCnoOTP(refNo , tokenId , amount , currency,xfield1){
        amount = amount.replace('.','').replace(',','');
        let data = refNo+tokenId+amount+currency+xfield1;
        data = constant.MERCHANTKEY_BC+constant.MERCHANTCODE_BC+data;
        console.log(data);
        return this.generate(data);
    }

    generate(data){
       // data = constant.MERCHANTKEY+constant.MERCHANTCODE+data;
        console.log(data);
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return  hash.digest('hex');
    }
}

module.exports = new Signature();