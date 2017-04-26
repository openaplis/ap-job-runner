'use strict'

const async = require('async')
const _ = require('lodash')
const aoRetriever = require('ap-mysql').aoRetriever
const cmdSubmitter = require('ap-mysql').cmdSubmitter
const taskOrder = require('ap-object').TaskOrder
const taskBreastFixationCheck = require('ap-object').TaskBreastFixationCheck
const aoUpdater = require('ap-mysql').aoUpdater
const clone = require('clone')

const queryStringGetCases = 'select ao.MasterAccessionNo, ao.PFirstName, ao.PLastName, so.Collectiontime, so.ProcessorRun, so.FixationStartTime, so.FixationEndTime, ' +
  'timestampdiff(HOUR, fixationstarttime, fixationendtime), FixationDuration, so.SpecimenOrderId, so.Description ' +
  'from tblAccessionOrder ao ' +
  'join tblSpecimenOrder so on ao.MasterAccessionno = so.MasterAccessionno ' +
  'where ao.AccessionDate >= DATE_ADD(curdate(), INTERVAL -10 DAY) ' +
  'and locate(\'Breast\', so.Description) > 0 ' +
  'and timestampdiff(HOUR, fixationstarttime, fixationendtime) > 72 ' +
  'order by ao.AccessionTime'

module.exports.run = (callback) => {
  cmdSubmitter.submit(queryStringGetCases, function (err, rows) {
    if(err) return callback(err)

    async.eachSeries(rows, function (row, callback) {

      async.waterfall([
        function (callback) {
          aoRetriever.retrieve(row.MasterAccessionNo, function (err, ao) {
            var aoClone = clone(ao)
            callback(null, ao, aoClone)
          })
        },
        function (ao, aoClone, callback) {
          var pso = _.find(ao.AccessionOrder.PanelSetOrders, { PanelSetOrder: { PanelSetId: 13 }})
          taskOrder.newItem(pso, taskBreastFixationCheck, 5134, 'OP', function (err, to) {
            if(err) return callback(err)
            pso.PanelSetOrder.TaskOrders.push(to)
            callback(null, ao, aoClone)
          })
        },
        function (ao, aoClone, callback) {
          aoUpdater.update(ao, aoClone, function (err, result) {
            if(err) return callback(err)
            console.log('Updating: ' + ao.AccessionOrder.MasterAccessionNo)
            callback(null, 'all done.')
          })
        }
      ], function (err, result) {
        if(err) return callback(err)
        callback(null, result)
      })

    }, function (err) {
      if (err) return callback(err)
      callback(null, 'The breast fixation exceptions have been handled.')
    })

  })
}
