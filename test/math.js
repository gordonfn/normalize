/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const math = require('../lib/math')

describe('Math', function () {
  it('Should reject isValid(invalid)', function(done) {
    let valid = math.isValid(undefined)
    expect(valid).to.equal(false)

    valid = math.isValid(null)
    expect(valid).to.equal(false)

    valid = math.isValid(NaN)
    expect(valid).to.equal(false)

    valid = math.isValid(Infinity)
    expect(valid).to.equal(false)

    valid = math.isValid(-Infinity)
    expect(valid).to.equal(false)

    valid = math.isValid('')
    expect(valid).to.equal(false)

    valid = math.isValid('a')
    expect(valid).to.equal(false)

    done()
  })

  it('Should accept isValid(valid)', function(done) {
    let valid = math.isValid(-2_147_483_647 - 1) // 32 bit
    expect(valid).to.equal(true)

    valid = math.isValid(0)
    expect(valid).to.equal(true)

    valid = math.isValid(  9_223_372_036_854_775_807 + 1) // 64 bit
    expect(valid).to.equal(true)

    valid = math.isValid(1.1)
    expect(valid).to.equal(true)
    done()
  })
})