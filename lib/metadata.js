let defaultMetadata = {
  id: null,
  observations: 0,
  spatial_extent: [-180, -90, 180, 90],
  vertical_extent: [-Infinity, Infinity],
  temporal_extent: [-Infinity, Infinity]
}
let metadata = {
  observations: 0
}

const parseExtents = (obj) => {
  const newObj = {}
  newObj.spatial_extent = obj.spatial_extent
    ? obj.spatial_extent.replace(/^BOX\((.+?) (.+?),(.+?) (.+?)\)$/, '$1,$2,$3,$4').split(',').map((v, idx) => v ? Number.parseFloat(v) : defaultMetadata.spatial_extent[idx])
    : defaultMetadata.spatial_extent
  newObj.vertical_extent = obj.vertical_extent
    ? obj.vertical_extent.replace(/^[\(\[](.*?),(.*?)[\)\]]$/, '$1,$2').replace(/"/g, '').split(',').map((v, idx) => v ? Number.parseFloat(v) : defaultMetadata.vertical_extent[idx])
    : defaultMetadata.vertical_extent
  newObj.temporal_extent = obj.temporal_extent
    ? obj.temporal_extent.replace(/^[\(\[](.*?),(.*?)[\)\]]$/, '$1,$2').replace(/"/g, '').split(',').map((v, idx) => v ? new Date(v) : defaultMetadata.temporal_extent[idx])
    : defaultMetadata.temporal_extent
  return newObj
}

const stringifyExtents = (obj) => {
  const newObj = {}
  newObj.spatial_extent = `BOX(${obj.spatial_extent[0]} ${obj.spatial_extent[1]}, ${obj.spatial_extent[2]} ${obj.spatial_extent[3]})`
  newObj.temporal_extent = `[${obj.temporal_extent[0]},${obj.temporal_extent[1]}]`
      .replace('[-Infinity', '(')
      .replace('Infinity]', ')')
  newObj.vertical_extent = `[${obj.vertical_extent[0]},${obj.vertical_extent[1]}]`
      .replace('[-Infinity', '(')
      .replace('Infinity]', ')')
  return newObj
}

const getId = () => metadata.id

const get = () => {
  const newObj = Object.assign({}, metadata)
  newObj.temporal_extent = newObj.temporal_extent
    ? newObj.temporal_extent.map((date, idx) => {
      if (date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)) {
        return date.toISOString()
      }
      return date  // Infinity
    })
    : defaultMetadata.temporal_extent

  return Object.assign({}, newObj, stringifyExtents(newObj))
}

const set = (values = {}) => {
  // requires { id } are passed in
  // remove nulls
  Object.keys(values).forEach(k => {
    if (values[k] === null) delete values[k]
  })

  Object.assign(metadata, defaultMetadata, values, parseExtents(values))
}

const update = (data) => {
  // t [min,max]
  if ((data.activity_start_date || null) !== null) {
    const minTime = new Date(`${data.activity_start_date}T${data.activity_start_time || '00:00:00'}${data.activity_start_time_zone || 'Z'}`)
    const maxTime =
      (data.activity_end_date || null) !== null
        ? new Date(
        Math.max(minTime, new Date(`${data.activity_end_date}T${data.activity_end_time || '00:00:00'}${data.activity_end_time_zone || 'Z'}`))
        )
        : minTime
    if (metadata.temporal_extent[0] === -Infinity && metadata.temporal_extent[1] ===  Infinity) {
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
    typeof data.monitoring_location_longitude_normalized === 'number' &&
    typeof data.monitoring_location_latitude_normalized === 'number'
  ) {
    if (JSON.stringify(metadata.spatial_extent) === '[-180,-90,180,90]') {
      metadata.spatial_extent = [
        data.monitoring_location_longitude_normalized,
        data.monitoring_location_latitude_normalized,
        data.monitoring_location_longitude_normalized,
        data.monitoring_location_latitude_normalized
      ]
    }
    metadata.spatial_extent[0] = Math.min(
      metadata.spatial_extent[0],
      data.monitoring_location_longitude_normalized
    )
    metadata.spatial_extent[1] = Math.min(
      metadata.spatial_extent[1],
      data.monitoring_location_latitude_normalized
    )
    metadata.spatial_extent[2] = Math.max(
      metadata.spatial_extent[2],
      data.monitoring_location_longitude_normalized
    )
    metadata.spatial_extent[3] = Math.max(
      metadata.spatial_extent[3],
      data.monitoring_location_latitude_normalized
    )
  }

  // z [min,max]
  if (typeof data.activity_depth_height_measure_normalized === 'number') {

    if (metadata.vertical_extent[0] === -Infinity && metadata.vertical_extent[1] ===  Infinity) {
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

module.exports = { getId, get, set, update, parseExtents, stringifyExtents }