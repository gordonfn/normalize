/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const temporal = require('../lib/temporal')

describe('Time', function () {
  it('should add timezone w/ daylight savings', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityStartTimeZone
    } = temporal({ ActivityStartDate: '2020-06-01', ActivityStartTime: '00:00:00' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityStartTimeZone).to.equal('-06:00')
  })

  it('should add timezone w/o daylight savings', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityStartTimeZone
    } = temporal({ ActivityStartDate: '2020-01-01', ActivityStartTime: '00:00:00' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityStartTimeZone).to.equal('-07:00')
  })

  it('should add timezone for Activity Start', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityStartTimeZone
    } = temporal({ ActivityStartDate: '2020-01-01', ActivityStartTime: '00:00:00' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityStartTimeZone).to.equal('-07:00')
  })

  it('should add timezone for Activity End', () => {
    const {
      MonitoringLocationTimeZone,
      ActivityEndTimeZone
    } = temporal({ ActivityEndDate: '2020-01-01', ActivityEndTime: '00:00:00' }, [-114, 51])

    expect(MonitoringLocationTimeZone).to.equal('America/Edmonton')
    expect(ActivityEndTimeZone).to.equal('-07:00')
  })

  it('should add timezone for Analysis Start positive', () => {
    const {
      AnalysisStartTimeZone
    } = temporal(
      { AnalysisStartTimeZone: '+02:30' },
      [-114, 51]
    )

    expect(AnalysisStartTimeZone).to.equal('+02:30')
  })

  it('should add timezone for Analysis Start negative w/ -0600', () => {
    const {
      AnalysisStartTimeZone
    } = temporal(
      { AnalysisStartTimeZone: '-0600' },
      [-114, 51]
    )

    expect(AnalysisStartTimeZone).to.equal('-06:00')
  })

  it('should add timezone for Analysis Start negative w/ -600', () => {
    const {
      AnalysisStartTimeZone
    } = temporal(
      { AnalysisStartTimeZone: '-600' },
      [-114, 51]
    )

    expect(AnalysisStartTimeZone).to.equal('-06:00')
  })

})
