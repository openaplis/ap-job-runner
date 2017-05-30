var path = require('path')
var jobRunnerService = require(path.join(__dirname, './core/job-runner-service'))

jobRunnerService.start(function (err, message) {
  if(err) return console.log(err)
  console.log(message)
})
