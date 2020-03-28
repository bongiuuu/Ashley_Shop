'use strict';
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = winston.createLogger({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    // create log file that rotates daily
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/dashboard-api-%DATE%.log`,
      timestamp: tsFormat,
      datePattern: 'YYYY-MM-DD',
      maxDays: 30,
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    })
  ]
});

module.exports = logger;