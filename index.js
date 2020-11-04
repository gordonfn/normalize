
const Transform = require('stream').Transform
const { snakeCase } = require('change-case')

const encode = require('./lib/encode')
const coordinate = require('./lib/coordinate')
const {characteristic, distance} = require('./lib/measure')
//const methodSpeciation = require('./lib/methodSpeciation')
const sanitize = require('./lib/sanitize')
const time = require('./lib/time')
const metadata = require('./lib/metadata')

const stream = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  async transform (chunk, encoding, callback) {
    chunk = JSON.parse(chunk.toString())

    // bad data in legacy dataset (72beacba-edac-4b71-beeb-d7d7eb371725 v1.0.0 has μS/cm)
    chunk.ResultUnit = encode(chunk.ResultUnit)
    chunk.ResultDetectionQuantitationLimitUnit = encode(chunk.ResultDetectionQuantitationLimitUnit)

    chunk = sanitize(chunk)
    chunk = makeObservation(chunk)

    // Change keys for DB use
    const record = {}
    Object.keys(chunk).forEach((key) => {
      record[snakeCase(key)] = chunk[key]
    })

    metadata.update(record)

    delete record.monitoring_location_latitude_normalized
    delete record.monitoring_location_longitude_normalized

    callback(null, JSON.stringify(record))
  }
})

const makeObservation = (data) => {

  const coord = coordinate(
    data.MonitoringLocationHorizontalCoordinateReferenceSystem,
    [data.MonitoringLocationLongitude, data.MonitoringLocationLatitude],
    6) // 6 decimal places: 1.1m accuracy

  const [
    ResultMeasureNormalized,
    ResultUnitNormalized
  ] = characteristic(data.CharacteristicName, data.ResultValue, data.ResultUnit)

  const [
    ResultDetectionQuantitationLimitMeasureNormalized,
    ResultDetectionQuantitationLimitUnitNormalized
  ] = characteristic(data.CharacteristicName, data.ResultDetectionQuantitationLimitMeasure, data.ResultDetectionQuantitationLimitUnit)

  const [
    ActivityDepthHeightMeasureNormalized,
    ActivityDepthHeightUnitNormalized
  ] = distance(data.ActivityDepthHeightMeasure, data.ActivityDepthHeightUnit)

  /*
  const [
    MonitoringLocationHorizontalAccuracyMeasureNormalized,
    MonitoringLocationHorizontalAccuracyUnitNormalized
  ] = distance(data.MonitoringLocationHorizontalAccuracyMeasure, data.MonitoringLocationHorizontalAccuracyUnit)
   */

  /*
  const [
    MonitoringLocationVerticalMeasureNormalized,
    MonitoringLocationVerticalUnitNormalized
  ] = distance(data.MonitoringLocationVerticalMeasure, data.MonitoringLocationVerticalUnit)
   */

  /*
  const [
    WellHoleDepthMeasureNormalized,
    WellHoleDepthUnitNormalized
  ] = distance(data.WellHoleDepthMeasure, data.WellHoleDepthUnit)
  // TODO Well Screen Interval measures
   */

  /*
  const [
    MethodSpeciationNormalized,
    MethodSpeciationMeasureNormalized
  ] = methodSpeciation(data.CharacteristicName, data.MethodSpeciation, data.ResultValueNormalized)
  // TODO ResultMethodSpeciationDetectionQuantitationLimitMeasureNormalized,
   */

  //const { ActivityGroupType } = calcActivityType(data)
  //const HorizontalCollectionMethod = 'Unknown'  // TODO add to DB

  // For COPY
  const MonitoringLocationCoordinateNormalized = `SRID=4326;POINT(${coord.join(' ')})`
  // COPY doesn't like '\r', needs to be escaped (\\r) or removed
  if (data.ResultComment) {
    data.ResultComment = data.ResultComment.replace("\r", '')
  }

  // TODO Move to publish, do in SQL
  //if (data.MonitoringLocationType === 'Unspecified') {}

  const {
    ActivityStartTimeZone,
    ActivityEndTimeZone,
    AnalysisStartTimeZone
  } = time(data, coord)

  const {
    //DatasetName,
    MonitoringLocationID,
    MonitoringLocationName,
    MonitoringLocationLatitude,
    MonitoringLocationLongitude,
    MonitoringLocationHorizontalCoordinateReferenceSystem,
    MonitoringLocationType,

    ActivityStartDate,
    ActivityStartTime,
    ActivityEndDate,
    ActivityEndTime,
    AnalysisStartDate,
    AnalysisStartTime,

    ActivityType,
    ActivityMediaName,
    ActivityDepthHeightMeasure,
    ActivityDepthHeightUnit,
    SampleCollectionEquipmentName,
    ResultDetectionCondition,
    CharacteristicName,
    MethodSpeciation,
    ResultSampleFraction,

    ResultValue,
    ResultUnit,
    ResultValueType,
    ResultStatusID,
    ResultComment,
    ResultAnalyticalMethodID,
    ResultAnalyticalMethodName,
    ResultAnalyticalMethodContext,
    ResultDetectionQuantitationLimitType,
    ResultDetectionQuantitationLimitMeasure,
    ResultDetectionQuantitationLimitUnit,

    LaboratoryName,
    LaboratorySampleID
  } = data

  const record = {
    //DatasetName: encode(DatasetName), // Not save to the database
    MonitoringLocationID,
    MonitoringLocationName: encode(MonitoringLocationName),
    MonitoringLocationLatitude,
    MonitoringLocationLongitude,
    MonitoringLocationHorizontalCoordinateReferenceSystem,
    MonitoringLocationType,

    ActivityStartDate,
    ActivityStartTime,
    ActivityEndDate,
    ActivityEndTime,
    AnalysisStartDate,
    AnalysisStartTime,

    ActivityType,
    ActivityMediaName,
    ActivityDepthHeightMeasure,
    ActivityDepthHeightUnit,
    SampleCollectionEquipmentName,
    ResultDetectionCondition,
    CharacteristicName,
    MethodSpeciation,
    SampleFraction: ResultSampleFraction, // rename for simplicity and guideline joining

    ResultValue,  // split into two (value / measure) if/when categorical data supported
    ResultUnit,
    ResultValueType,
    ResultStatusID,
    ResultComment: encode(ResultComment),
    ResultAnalyticalMethodID,
    ResultAnalyticalMethodName,
    ResultAnalyticalMethodContext,
    ResultDetectionQuantitationLimitType,
    ResultDetectionQuantitationLimitMeasure,
    ResultDetectionQuantitationLimitUnit,

    LaboratoryName: encode(LaboratoryName),
    LaboratorySampleID,

    // Normalized
    MonitoringLocationLongitudeNormalized: coord[0],
    MonitoringLocationLatitudeNormalized: coord[1],
    MonitoringLocationCoordinateNormalized,
    ActivityDepthHeightMeasureNormalized,
    ActivityDepthHeightUnitNormalized,
    ResultMeasureNormalized,
    ResultUnitNormalized,
    ResultDetectionQuantitationLimitMeasureNormalized,
    ResultDetectionQuantitationLimitUnitNormalized,

    // Calculated
    ActivityStartTimeZone,
    ActivityEndTimeZone,
    AnalysisStartTimeZone,

    // Internal
    DatasetID: metadata.getId,
  }

  return record
}


module.exports = {stream}