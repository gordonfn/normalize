/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const sanitize = require('../lib/sanitize')

describe('Sanitize', function () {

  it('Should sanitize data', function (done) {
    let data = {
      "DatasetName":"Test",
      "MonitoringLocationID":"A1",
      "MonitoringLocationName":"A1 Test",
      "MonitoringLocationLatitude":"51.0486",
      "MonitoringLocationLongitude":"-114.0708",
      "MonitoringLocationHorizontalCoordinateReferenceSystem":"AMSMA",
      "MonitoringLocationType":"ocean",
      "ActivityType":"Field Msr/Obs",
      "ActivityMediaName":"pore water",
      "ActivityDepthHeightMeasure":"-34",
      "ActivityDepthHeightUnit":"m",
      "SampleCollectionEquipmentName":"bucket",
      "CharacteristicName":"aluminum",
      "MethodSpeciation":"as B",
      "ResultSampleFraction":"Dissolved",
      "ResultValue":"99.99",
      "ResultUnit":"#/100ml",
      'ResultValueType':'Actual',
      "ResultStatusID":"Accepted",
      "ResultComment":"None at this time",
      "ResultAnalyticalMethodID":"1",
      "ResultAnalyticalMethodContext":"APHA",
      "ActivityStartDate":"2018-02-23",
      "ActivityStartTime":"13:15:00",
      "ActivityEndDate":"2018-02-23",
      "ActivityEndTime":"13:15:00",
      "LaboratoryName":"Farrell Labs",
      "LaboratorySampleID":"101010011110",
      "AnalysisStartDate":"2018-02-23",
      "AnalysisStartTime":"13:15:00",
      "AnalysisStartTimeZone":"-06:00"
    }

    const valid = sanitize(data)

    expect(data.ResultValue).to.equal(99.99)
    done()
  })

})