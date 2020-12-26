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

  it('should add timezone for Analysis Start', () => {
    const {
      MonitoringLocationTimeZone,
      AnalysisStartTimestamp,
      AnalysisStartTimeZone
    } = time(
      { AnalysisStartDate: '2020-01-01', AnalysisStartTimeZone: '+00:00' },
      [-114, 51]
    )

    expect(AnalysisStartTimestamp).to.equal('2020-01-01T00:00:00+00:00')
    expect(AnalysisStartTimeZone).to.equal('+00:00')
  })
})
