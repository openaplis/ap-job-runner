'use strict'

const path = require('path')
const grpc = require('grpc')

const PROTO_PATH = path.resolve('./node_modules/ap-protobuf/src/fedex/fedex.proto')
const fedex_proto = grpc.load(PROTO_PATH).fedex
const client = new fedex_proto.UpdateFedexShipments('localhost:50052', grpc.credentials.createInsecure())

module.exports = {
  update: (callback) => client.update({ message: 'update' }, function(err, response) {
    callback(null, 'Fedex shipments have been updated.')
  })
}
