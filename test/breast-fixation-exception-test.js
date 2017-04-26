const assert = require('chai').assert
const path = require('path')
const fs = require('fs')
const breastFixationExceptions = require('../src/core/breast-fixation-exceptions.js')

describe('Task Order Object Tests', function() {
  it('Retrieve', function(done) {
    breastFixationExceptions.run(function (err, result) {
      if(err) return console.log(err)
      console.log(result)
      done()
    })
  })
})
