'use strict'

const CronJob = require('cron').CronJob
const fs = require('fs')
const path = require('path')

const aoBuilder = require('ap-mysql').aoBuilder
const fedexClient = require('ap-fedex').fedexClient
const breastFixationExceptions = require('./core/breast-fixation-exceptions.js')

function main() {

  var updateFexShipmentsJob = new CronJob('*/15 * * * * *', function() {
    fedexClient.ping({ message: 'Whats up doc' }, function (err, message) {
      console.log(message)
    })
  }, null, true, null)

  //var breastFixationExceptionsJob = new CronJob('*/10 * * * * *', function() {
  //  breastFixationExceptions.run(function (err, result) {
  //    if(err) return console.log(err)
  //    console.log(result)
      //winston.info(result)
  //  })
  //}, null, true, null)

}

main()
