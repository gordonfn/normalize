/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const methodSpeciation = require('../lib/methodSpeciation')

describe('Method Speciation', function () {
  it('Should not need test, future', function(done) {
    expect(true).to.equal(true)
    done()
  })
})
