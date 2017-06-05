'use static'

const grpc = require('grpc')
const path = require('path')
const CronJob = require('cron').CronJob

const FEDEX_PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/fedex/fedex-service.proto')
const fedex_proto = grpc.load(FEDEX_PROTO_PATH).fedex
const fedexService = new fedex_proto.FedexService(process.env.AP_FEDEX_SERVICE_BINDING, grpc.credentials.createInsecure())

module.exports = {
  start: function (callback) {
    var updateFexShipmentsJob = new CronJob('* */2 * * * *', function() {
      fedexService.updateShipments({ message: 'null'}, function (err, message) {
        if(err) return console.log(err)
        console.log(message)
      })
    }, null, true, null)
    callback(null, { message: 'Update Shipments is up and running.' })
  }
}
