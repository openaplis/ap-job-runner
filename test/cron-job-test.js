const assert = require('chai').assert
const CronJob = require('cron').CronJob

var updateFexShipmentsJob = new CronJob('0 */60 16-20 * * 1-5', function() {
  console.log('Cron job has run')
}, null, true, null)
