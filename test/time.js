/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const time = require('../lib/time')

describe('Time', function () {
  it('should add timezone w/ daylight savings', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityStartTimestamp,
      ActivityStartTimeZone
    } = time({ ActivityStartDate: '2020-06-01' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityStartTimestamp).to.equal('2020-06-01T00:00:00-06:00')
    expect(ActivityStartTimeZone).to.equal('-06:00')
  })

  it('should add timezone w/o daylight savings', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityStartTimestamp,
      ActivityStartTimeZone
    } = time({ ActivityStartDate: '2020-01-01' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityStartTimestamp).to.equal('2020-01-01T00:00:00-07:00')
    expect(ActivityStartTimeZone).to.equal('-07:00')
  })

  it('should add timezone for Activity Start', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityStartTimestamp,
      ActivityStartTimeZone
    } = time({ ActivityStartDate: '2020-01-01' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityStartTimestamp).to.equal('2020-01-01T00:00:00-07:00')
    expect(ActivityStartTimeZone).to.equal('-07:00')
  })

  it('should add timezone for Activity End', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityEndTimestamp,
      ActivityEndTimeZone
    } = time({ ActivityEndDate: '2020-01-01' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityEndTimestamp).to.equal('2020-01-01T00:00:00-07:00')
    expect(ActivityEndTimeZone).to.equal('-07:00')
  })

  it('should add timezone for Analysis Start positive', () => {
    const {
      MonitoringLocationTimeZone,
      AnalysisStartTimestamp,
      AnalysisStartTimeZone
    } = time(
      { AnalysisStartDate: '2020-01-01', AnalysisStartTimeZone: '+02:30' },
      [-114, 51]
    )

    expect(AnalysisStartTimestamp).to.equal('2020-01-01T00:00:00+02:30')
    expect(AnalysisStartTimeZone).to.equal('+02:30')
  })

  it('should add timezone for Analysis Start negative w/ -0600', () => {
    const {
      MonitoringLocationTimeZone,
      AnalysisStartTimestamp,
      AnalysisStartTimeZone
    } = time(
      { AnalysisStartDate: '2020-01-01', AnalysisStartTimeZone: '-0600' },
      [-114, 51]
    )

    expect(AnalysisStartTimestamp).to.equal('2020-01-01T00:00:00-06:00')
    expect(AnalysisStartTimeZone).to.equal('-06:00')
  })

  it('should add timezone for Analysis Start negative w/ -600', () => {
    const {
      MonitoringLocationTimeZone,
      AnalysisStartTimestamp,
      AnalysisStartTimeZone
    } = time(
      { AnalysisStartDate: '2020-01-01', AnalysisStartTimeZone: '-600' },
      [-114, 51]
    )

    expect(AnalysisStartTimestamp).to.equal('2020-01-01T00:00:00-06:00')
    expect(AnalysisStartTimeZone).to.equal('-06:00')
  })

})
