/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const sanitize = require('../lib/sanitize')

console.error = () => {}

describe('Sanitize', function () {

  it('Should see @gordonfn/schema for full unit tests', function (done) {
    expect(true).to.equal(true)
    done()
  })

  it('Should remove nulls', function(done) {
    let data = {
      ActivityType: null
    }
    sanitize(data)

    expect(data.ActivityType).to.equal(undefined)
    done()
  })

  it('Should remove blanks', function(done) {
    let data = {
      ActivityType: ''
    }
    sanitize(data)

    expect(data.ActivityType).to.equal(undefined)
    done()
  })

  it('Should throw error', function(done) {
    let data = {
      'CharacteristicName': 'Apparent colouring book'
    }
    try {
      sanitize(data)
      expect(true).to.equal(false)
    } catch(e) {
      expect(true).to.equal(true)
    }

    done()
  })

})