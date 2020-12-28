/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const metadata = require('../lib/metadata')

console.error = () => {}

describe('Metadata', function () {
  it('should get default values', () => {
    metadata.set()
    const value = metadata.get()

    expect(value.observations).to.equal(0)
    expect(value.temporal_extent).to.equal('(,)')
    expect(value.spatial_extent).to.equal('BOX(-180 -90, 180 90)')
    expect(value.vertical_extent).to.equal('(,)')
  })

  it('should get id', () => {
    metadata.set({ id: '00000000-0000-0000-0000-000000000000' })
    const value = metadata.get()

    expect(value.id).to.equal('00000000-0000-0000-0000-000000000000')
    expect(metadata.getId()).to.equal('00000000-0000-0000-0000-000000000000')
  })

  describe('Temporal', function () {
    it('should process null', () => {
      const min = '2010-01-01'
      const max = '2020-02-02'
      metadata.set({ temporal_extent: null })
      metadata.update({
        activity_start_date: min
      })
      metadata.update({
        activity_start_date: max
      })
      const value = metadata.get()

      expect(value.temporal_extent).to.equal(
        `[${min}T00:00:00.000Z,${max}T00:00:00.000Z]`
      )
    })

    it('should process empty', () => {
      const min = '2010-01-01'
      const max = '2020-02-02'
      metadata.set({ temporal_extent: '(,)' })
      metadata.update({
        activity_start_date: min
      })
      metadata.update({
        activity_start_date: max
      })
      const value = metadata.get()

      expect(value.temporal_extent).to.equal(
        `[${min}T00:00:00.000Z,${max}T00:00:00.000Z]`
      )
    })

    it('should update existing', () => {
      const min = '1980-01-01'
      const max = '2020-02-02'
      metadata.set({
        temporal_extent: '[2000-01-01T00:00:00.000Z,2000-01-01T00:00:00.000Z]'
      })
      metadata.update({
        activity_start_date: min
      })
      metadata.update({
        activity_start_date: min,
        activity_end_date: max
      })
      const value = metadata.get()

      expect(value.temporal_extent).to.equal(
        `[${min}T00:00:00.000Z,${max}T00:00:00.000Z]`
      )
    })

    it('should not update existing', () => {
      const min = '2010-01-01'
      const max = '2020-02-02'
      metadata.set({
        temporal_extent: '[1900-01-01T00:00:00.000Z,2100-01-01T00:00:00.000Z]'
      })
      metadata.update({
        activity_start_date: min
      })
      metadata.update({
        activity_start_date: max
      })
      const value = metadata.get()

      expect(value.temporal_extent).to.equal(
        '[1900-01-01T00:00:00.000Z,2100-01-01T00:00:00.000Z]'
      )
    })
  })

  describe('Spatial', function () {
    it('should process null', () => {
      const min = -1
      const max = 1
      metadata.set({ spatial_extent: null })
      metadata.update({
        monitoring_location_longitude_normalized: min,
        monitoring_location_latitude_normalized: min
      })
      metadata.update({
        monitoring_location_longitude_normalized: max,
        monitoring_location_latitude_normalized: max
      })
      const value = metadata.get()

      expect(value.spatial_extent).to.equal(`BOX(${min} ${min}, ${max} ${max})`)
    })

    it('should process on zero', () => {
      const min = 0
      const max = 0
      metadata.set({ spatial_extent: 'BOX(0 0, 0 0)' })
      metadata.update({
        monitoring_location_longitude_normalized: min,
        monitoring_location_latitude_normalized: min
      })
      metadata.update({
        monitoring_location_longitude_normalized: max,
        monitoring_location_latitude_normalized: max
      })
      const value = metadata.get()

      expect(value.spatial_extent).to.equal(`BOX(${min} ${min}, ${max} ${max})`)
    })

    it('should process to zero', () => {
      const min = 0
      const max = 10
      metadata.set({ spatial_extent: 'BOX(10 10, 10 10)' })
      metadata.update({
        monitoring_location_longitude_normalized: min,
        monitoring_location_latitude_normalized: min
      })
      metadata.update({
        monitoring_location_longitude_normalized: max,
        monitoring_location_latitude_normalized: max
      })
      const value = metadata.get()

      expect(value.spatial_extent).to.equal(`BOX(${min} ${min}, ${max} ${max})`)
    })

    it('should update existing', () => {
      const min = -1
      const max = 1
      metadata.set({ spatial_extent: 'BOX(0 0, 0 0)' })
      metadata.update({
        monitoring_location_longitude_normalized: min,
        monitoring_location_latitude_normalized: min
      })
      metadata.update({
        monitoring_location_longitude_normalized: max,
        monitoring_location_latitude_normalized: max
      })
      const value = metadata.get()

      expect(value.spatial_extent).to.equal(`BOX(${min} ${min}, ${max} ${max})`)
    })

    it('should not update existing', () => {
      const min = -1
      const max = 1
      metadata.set({ spatial_extent: 'BOX(-100 -100, 100 100)' })
      metadata.update({
        monitoring_location_longitude_normalized: min,
        monitoring_location_latitude_normalized: min
      })
      metadata.update({
        monitoring_location_longitude_normalized: max,
        monitoring_location_latitude_normalized: max
      })
      const value = metadata.get()

      expect(value.spatial_extent).to.equal('BOX(-100 -100, 100 100)')
    })
  })

  describe('Vertical', function () {
    it('should process null', () => {
      const min = -1
      const max = 1
      metadata.set({ vertical_extent: null })
      metadata.update({
        activity_depth_height_measure_normalized: min
      })
      metadata.update({
        activity_depth_height_measure_normalized: max
      })
      const value = metadata.get()

      expect(value.vertical_extent).to.equal(`[${min},${max}]`)
    })

    it('should process empty', () => {
      const min = -1
      const max = 1
      metadata.set({ vertical_extent: '(,)' })
      metadata.update({
        activity_depth_height_measure_normalized: min
      })
      metadata.update({
        activity_depth_height_measure_normalized: max
      })
      const value = metadata.get()

      expect(value.vertical_extent).to.equal(`[${min},${max}]`)
    })

    it('should process on zero', () => {
      const min = 0
      const max = 0
      metadata.set({ vertical_extent: '[0,0]' })
      metadata.update({
        activity_depth_height_measure_normalized: min
      })
      metadata.update({
        activity_depth_height_measure_normalized: max
      })
      const value = metadata.get()

      expect(value.vertical_extent).to.equal(`[${min},${max}]`)
    })

    it('should process to zero', () => {
      const min = 0
      const max = 10
      metadata.set({ vertical_extent: '[10,10]' })
      metadata.update({
        activity_depth_height_measure_normalized: min
      })
      metadata.update({
        activity_depth_height_measure_normalized: max
      })
      const value = metadata.get()

      expect(value.vertical_extent).to.equal(`[${min},${max}]`)
    })

    it('should update existing', () => {
      const min = -1
      const max = 1
      metadata.set({ vertical_extent: '[0,0]' })
      metadata.update({
        activity_depth_height_measure_normalized: min
      })
      metadata.update({
        activity_depth_height_measure_normalized: max
      })
      const value = metadata.get()

      expect(value.vertical_extent).to.equal(`[${min},${max}]`)
    })

    it('should not update existing', () => {
      const min = -1
      const max = 1
      metadata.set({ vertical_extent: '[-100,100]' })
      metadata.update({
        activity_depth_height_measure_normalized: min
      })
      metadata.update({
        activity_depth_height_measure_normalized: max
      })
      const value = metadata.get()

      expect(value.vertical_extent).to.equal('[-100,100]')
    })
  })
})
