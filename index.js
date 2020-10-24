
const Transform = require('stream').Transform
const { snakeCase } = require('change-case')

const encode = require('./lib/encode')
const coordinate = require('./lib/coordinate')
const {characteristic, distance} = require('./lib/measure')
const methodSpeciation = require('./lib/methodSpeciation')
const sanitize = require('./lib/sanitize')
const time = require('./lib/time')
const vertical = require('./lib/vertical')

let metadata = {
  observations: 0,
  spatial_extent: [-180, -90, 180, 90],
  vertical_extent: [-Infinity, Infinity],
  temporal_extent: [-Infinity, Infinity]
}

const getMetadata = () => {

  metadata.temporal_extent = metadata.temporal_extent.map(date => {
    if (date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)) {
      return date.toISOString()
    }
    return date  // Infinity
  })

  // ensure extent arrays are in proper format
  metadata.spatial_extent = `BOX(${metadata.spatial_extent[0]} ${metadata.spatial_extent[1]}, ${metadata.spatial_extent[2]} ${metadata.spatial_extent[3]})`
  metadata.temporal_extent = `[${metadata.temporal_extent[0]},${metadata.temporal_extent[1]}]`
    .replace('[-Infinity', '(')
    .replace('Infinity]', ')')
  metadata.vertical_extent = `[${metadata.vertical_extent[0]},${metadata.vertical_extent[1]}]`
    .replace('[-Infinity', '(')
    .replace('Infinity]', ')')

  return metadata
}

const setMetadata = (values) => {
  // requires { id, create_timestamp } are passed in
  // remove nulls
  Object.keys(values).forEach(k => {
    if (!values[k]) delete values[k]
  } )
  metadata = Object.assign({}, metadata, values)
}

const stream = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  async transform (chunk, encoding, callback) {

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

    makeMetadata(record)

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
    DatasetID: metadata.id,
    CreateTimestamp: metadata.create_timestamp // for datastream growth metrics and rollback edge case (multi preview patches)
  }

  return record
}


const makeMetadata = (data) => {
  // t [min,max]
  if ((data.activity_start_date || null) !== null) {
    const minTime = new Date(`${data.activity_start_date}T${data.activity_start_time || '00:00:00'}`)
    const maxTime =
      (data.activity_end_date || null) !== null
        ? new Date(
        Math.max(minTime, new Date(`${data.activity_end_date}T${data.activity_end_time || '00:00:00'}`))
        )
        : minTime
    if (metadata.temporal_extent[0] === -Infinity) {
      metadata.temporal_extent = [minTime, maxTime]
    }

    metadata.temporal_extent[0] = new Date(
      Math.min(metadata.temporal_extent[0], minTime)
    )
    metadata.temporal_extent[1] = new Date(
      Math.max(metadata.temporal_extent[1], maxTime)
    )
  }
  // x,y [xmin,ymin,xmax,ymax]
  if (
    data.monitoring_location_longitude !== null &&
    data.monitoring_location_latitude !== null
  ) {
    if (metadata.spatial_extent[0] === -180) {
      metadata.spatial_extent = [
        data.monitoring_location_longitude,
        data.monitoring_location_latitude,
        data.monitoring_location_longitude,
        data.monitoring_location_latitude
      ]
    }
    metadata.spatial_extent[0] = Math.min(
      metadata.spatial_extent[0],
      data.monitoring_location_longitude
    )
    metadata.spatial_extent[1] = Math.min(
      metadata.spatial_extent[1],
      data.monitoring_location_latitude
    )
    metadata.spatial_extent[2] = Math.max(
      metadata.spatial_extent[2],
      data.monitoring_location_longitude
    )
    metadata.spatial_extent[3] = Math.max(
      metadata.spatial_extent[3],
      data.monitoring_location_latitude
    )
  }

  // z [min,max]
  if (data.activity_depth_height_measure_normalized !== null) {
    if (metadata.vertical_extent[0] === -Infinity) {
      metadata.vertical_extent = [
        data.activity_depth_height_measure_normalized,
        data.activity_depth_height_measure_normalized
      ]
    }
    metadata.vertical_extent[0] = Math.min(
      metadata.vertical_extent[0],
      data.activity_depth_height_measure_normalized
    )
    metadata.vertical_extent[1] = Math.max(
      metadata.vertical_extent[1],
      data.activity_depth_height_measure_normalized
    )
  }

  metadata.observations += 1

  return metadata
}

module.exports = {stream, getMetadata, setMetadata}