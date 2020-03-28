'use strict';

const logger = require('../shared/logger')('common:generalErrorHandler');

const errorMapping = {
    100: 'INVALID_KEY',
    101: 'INVALID_APP',
    102: 'INVALID_TOKEN',
    103: 'INVALID_LOGIN_CREDENTIAL',
    104: 'INVALID_DATA'
}
class GeneralErrorHandler {
    handleError(code, req, res, next) {
        if (code) {
            if (code instanceof Error) {
                logger(`unhandled Error ${code}`);
                res.status(401).send({ code: 500, message: code.message });
            } else if (errorMapping[code] !== undefined) {
                logger(`handError ${code}`);
                res.status(401).send({ code: code, message: errorMapping[code] });
            } else {
                logger(`unhandle error`);
                res.status(500).send({ code: 500, message: 'UNHANDLED_ERROR' });
            }
        } else {
            logger(`unhandle error`);
            res.status(500).send({ code: 500, message: 'UNHANDLED_ERROR' });
        }
    };
}

module.exports = new GeneralErrorHandler();