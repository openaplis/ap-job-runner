
const fs = require('fs')
const mssql = require('mssql')

const queryString = 'select ao.MasterAccessionNo, ao.PFirstName, ao.PLastName, so.Collectiontime, so.ProcessorRun, so.FixationStartTime, so.FixationEndTime, ' +
  'datediff(hh, fixationstarttime, fixationendtime) [FixationDurationCalc], FixationDuration, so.Description ' +
  'from tblAccessionOrder ao ' +
  'join tblspecimenOrder so on ao.masterAccessionNo = so.MasterAccessionNo ' +
  'where charindex(\'Breast\', so.Description) > 0 ' +
  'and ao.AccessionDate >= dateadd(d, -30, getdate()) ' +
  'and datediff(hh, fixationstarttime, fixationendtime) > 72 ' +
  'order by ao.AccessionTime desc'

//const config = require('../../ap-secrets/mssql-config/mssql-config')
const secret = require('../../ap-secrets/src/index')
secret.mssqlConfig(function (err, config) {
  if(err) throw err
  mssql.connect(config, function(err) {
      var request = new mssql.Request()
      request.stream = true
      request.query(queryString)

      request.on('recordset', function(columns) {

      })

      request.on('row', function(row) {
      	console.log(row)
      })

      request.on('error', function(err) {
      	// May be emitted multiple times
      })

      request.on('done', function(affected) {
      	console.log('done.')
      })
  })
})
