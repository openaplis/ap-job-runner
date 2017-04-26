'use strict'

const winston = require('winston')
const CronJob = require('cron').CronJob
const fs = require('fs')
const path = require('path')

const updateFedexShipments = require('./core/update-fedex-shipments.js')
const breastFixationExceptions = require('./core/breast-fixation-exceptions.js')
const logDir = path.resolve('./log')

function main() {

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }

  winston.add(winston.transports.File, {
    'name': 'access-file',
    'level': 'info',
    'filename': path.join(logDir, 'app.log'),
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true
  })

  //var updateFexShipmentsJob = new CronJob('0 0 18 1/1 * ? *', function() {
  //  updateFedexShipments.update(function (err, result) {
  //    winston.info(result)
  //  })
  //}, null, true, null)

  var breastFixationExceptionsJob = new CronJob('*/10 * * * * *', function() {
    breastFixationExceptions.run(function (err, result) {
      if(err) return console.log(err)
      console.log(result)
      //winston.info(result)
    })
  }, null, true, null)

}

main()
