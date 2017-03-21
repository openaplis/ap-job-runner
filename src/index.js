'use strict'

const winston = require('winston');
const CronJob = require('cron').CronJob
const fs = require('fs')
const logDir = 'log'
const env = process.env.NODE_ENV || 'info'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString()

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
})

var job = new CronJob('00 41 11 * * 1-5', function() {
  logger.info('The cron job fired successfully.')
}, null, true, null)
