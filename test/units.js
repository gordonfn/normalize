/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const units = require('../lib/unit')

describe('Units', function () {
  describe('convert', function () {
    it('should convert undefined', () => {
      const value = units.convert(undefined, '', '')

      expect(value).to.equal(null)
    })

    it('should convert null', () => {
      const value = units.convert(null, '', '')

      expect(value).to.equal(null)
    })

    it('should convert ""', () => {
      const value = units.convert(1, '', '')

      expect(value).to.equal(1)
    })

    it('should convert None', () => {
      const value = units.convert(1, 'None', '')

      expect(value).to.equal(1)
    })

    it('should convert same units', () => {
      const value = units.convert(1, 'mg/L', 'mg/L')

      expect(value).to.equal(1)
    })

    it('should convert Distance', () => {
      const value = units.convert(100, 'cm', 'm')

      expect(value).to.equal(1)
    })

    it('should convert Concentration', () => {
      const value = units.convert(1, 'ppm', 'mg/L')

      expect(value).to.equal(1)
    })

    it('should convert Concentration', () => {
      const value = units.convert(1, 'JTU', 'mg/L')

      expect(value).to.equal(1)
    })

    it('should convert Concentration', () => {
      const value = units.convert(3, 'NTU', 'mg/L')

      expect(value).to.equal(1)
    })

    it('should convert UV Absorbance', () => {
      const value = units.convert(100, 'L/mg-m', 'L/mg-cm')

      expect(value).to.equal(1)
    })

    it('should convert w/ #/100mL', () => {
      const value = units.convert(1, '#/100mL', '#/100mL')

      expect(value).to.equal(1)
    })

    it('should convert w/ %saturatn', () => {
      const value = units.convert(1, '%saturatn', '%')

      expect(value).to.equal(1)
    })

    it('should convert w/ %saturatn', () => {
      const value = units.convert(1, '%saturatn', '%')

      expect(value).to.equal(1)
    })

    it('should convert w/ #/mL', () => {
      const value = units.convert(100, '#/mL', '#/100mL')

      expect(value).to.equal(1)
    })

    it('should convert w/ hPa', () => {
      const value = units.convert(10, 'hPa', 'Pa')

      expect(value).to.equal(1000)
    })

    it('should convert w/ kPa', () => {
      const value = units.convert(1000, 'Pa', 'kPa')

      expect(value).to.equal(1)
    })

  })

  describe('convertList', function () {
    it('should convert a single unit', () => {
      const [value,unit] = units.convertList(1, 'g/L', 'mg/L')

      expect(value).to.equal(1000)
      expect(unit).to.equal('mg/L')
    })

    it('should convert to single unit from array', () => {
      const [value,unit] = units.convertList(1, 'g/L', ['%','mg/L'])

      expect(value).to.equal(1000)
      expect(unit).to.equal('mg/L')
    })

    it('should convert to single unit from array with dup types', () => {
      const [value,unit] = units.convertList(1, 'g/L', ['%','mg/L','ug/L'])

      expect(value).to.equal(1000)
      expect(unit).to.equal('mg/L')
    })
  })
})
