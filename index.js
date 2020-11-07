
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
  writableObjectMode: true,
  readableObjectMode: true,
  async transform (chunk, encoding, callback) {

    // bad data in legacy dataset (72beacba-edac-4b71-beeb-d7d7eb371725 v1.0.0 has μS/cm)
    chunk.ResultUnit = encode(chunk.ResultUnit)
    chunk.ResultDetectionQuantitationLimitUnit = encode(chunk.ResultDetectionQuantitationLimitUnit)

    chunk = sanitize(chunk)
    chunk = makeObservation(chunk)

    // Change keys for DB use
    const record = {}
    Object.keys(chunk).forEach((key) => {
      record[snakeCase(key)] = chunk[key] !== undefined ? chunk[key] : null
    })

    metadata.update(record)

    // used for metadata update only
    delete record.monitoring_location_latitude_normalized
    delete record.monitoring_location_longitude_normalized

    callback(null, record)
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
    // Internal
    DatasetID: metadata.getId(),

    // Schema
    //DatasetName: encode(DatasetName), // Not save to the database
    MonitoringLocationID,
    MonitoringLocationName: encode(MonitoringLocationName),
    MonitoringLocationType,
    MonitoringLocationLatitude,
    MonitoringLocationLongitude,
    MonitoringLocationHorizontalCoordinateReferenceSystem,

    ActivityType,
    ActivityMediaName,
    ActivityStartDate,
    ActivityStartTime,
    ActivityStartTimeZone,  // Calculated
    ActivityEndDate,
    ActivityEndTime,
    ActivityEndTimeZone,  // Calculated

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

    LaboratoryName: encode(LaboratoryName),
    LaboratorySampleID,
    AnalysisStartDate,
    AnalysisStartTime,
    AnalysisStartTimeZone,  // Calculated

    ResultDetectionQuantitationLimitType,
    ResultDetectionQuantitationLimitMeasure,
    ResultDetectionQuantitationLimitUnit,

    // Normalized
    MonitoringLocationCoordinateNormalized,
    ActivityDepthHeightMeasureNormalized,
    ActivityDepthHeightUnitNormalized,
    ResultMeasureNormalized,
    ResultUnitNormalized,
    ResultDetectionQuantitationLimitMeasureNormalized,
    ResultDetectionQuantitationLimitUnitNormalized,

    // For metadata update only
    MonitoringLocationLongitudeNormalized: coord[0],
    MonitoringLocationLatitudeNormalized: coord[1],
  }

  return record
}

const columns = ['dataset_id',
  'monitoring_location_id',
  'monitoring_location_name',
  'monitoring_location_type', 'monitoring_location_latitude',
  'monitoring_location_longitude', 'monitoring_location_horizontal_coordinate_reference_system',
  'activity_type', 'activity_media_name',
  'activity_start_date', 'activity_start_time',
  'activity_start_time_zone', 'activity_end_date',
  'activity_end_time', 'activity_end_time_zone',
  'activity_depth_height_measure', 'activity_depth_height_unit',
  'sample_collection_equipment_name', 'result_detection_condition',
  'characteristic_name', 'method_speciation',
  'sample_fraction', 'result_value',
  'result_unit', 'result_value_type',
  'result_status_id', 'result_comment',
  'result_analytical_method_id', 'result_analytical_method_name',
  'result_analytical_method_context', 'laboratory_name',
  'laboratory_sample_id', 'analysis_start_date',
  'analysis_start_time', 'analysis_start_time_zone',
  'result_detection_quantitation_limit_type', 'result_detection_quantitation_limit_measure',
  'result_detection_quantitation_limit_unit',
  'monitoring_location_coordinate_normalized',
  'activity_depth_height_measure_normalized',
  'activity_depth_height_unit_normalized', 'result_measure_normalized',
  'result_unit_normalized', 'result_detection_quantitation_limit_measure_normalized',
  'result_detection_quantitation_limit_unit_normalized']


module.exports = {stream, columns}