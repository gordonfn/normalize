/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const normalize = require('../lib/measure')

console.error = () => {}

describe('Normalize', function () {
  describe('Empty Values', function () {
    it('should has value zero', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('', 0, 'None')

      expect(NormalizedResultValue).to.equal(0)
      expect(NormalizedResultUnit).to.equal('')
    })

    it('should have value null', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('', null, null)

      expect(NormalizedResultValue).to.equal(null)
      expect(NormalizedResultUnit).to.equal(null)
    })

    it('should have value blank', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('', '', '')

      expect(NormalizedResultValue).to.equal('')
      expect(NormalizedResultUnit).to.equal('')
    })
  })

  it('should use ResultDetectionCondition - Special Case', () => {
    const [
      NormalizedResultValue,
      NormalizedResultUnit
    ] = normalize.characteristic('', 1, 'g')

    expect(NormalizedResultValue).to.equal(1)
    expect(NormalizedResultUnit).to.equal('g')
  })

  describe('Characteristics', function () {
    it('should convert Chloride - Override Unit', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('Chloride', 1, 'g/l')

      expect(NormalizedResultValue).to.equal(1000)
      expect(NormalizedResultUnit).to.equal('mg/L')
    })

    it('should convert Plutonium - Group Unit', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('Plutonium', 1, 'g/l')

      expect(NormalizedResultValue).to.equal(1000000)
      expect(NormalizedResultUnit).to.equal('µg/L')
    })

    it('should convert Fecal Coliform - Group No Unit', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('Fecal Coliform', 1, 'cfu/100ml')

      expect(NormalizedResultValue).to.equal(1)
      expect(NormalizedResultUnit).to.equal('CFU/100mL')
    })
  })

  describe('Unit Conversions', function () {
    it('should convert None', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('pH', 1, 'None')

      expect(NormalizedResultValue).to.equal(1)
      expect(NormalizedResultUnit).to.equal('')
    })
    it('should convert NTU', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('Chloride', 3, 'NTU')

      expect(NormalizedResultValue).to.equal(1)
      expect(NormalizedResultUnit).to.equal('mg/L')
    })

    it('should convert JTU', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('Chloride', 1, 'JTU')

      expect(NormalizedResultValue).to.equal(1)
      expect(NormalizedResultUnit).to.equal('mg/L')
    })

    it('should convert ppm', () => {
      const [
        NormalizedResultValue,
        NormalizedResultUnit
      ] = normalize.characteristic('Chloride', 1, 'ppm')

      expect(NormalizedResultValue).to.equal(1)
      expect(NormalizedResultUnit).to.equal('mg/L')
    })
  })
})
