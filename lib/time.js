const toDate = require('date-fns-tz').toDate
const tzlookup = require('tz-lookup')

// Need to pad time is short time format was used ie 8:30 -> 08:30
const padTime = (time) => {
  return (time || '00:00:00')
    .split(':')
    .map((t) => (t.length === 1 ? '0' + t : t))
    .join(':')
}

function isValidDate (str) {
  const d = new Date(str)
  return d instanceof Date && !isNaN(d)
}

const toString = (date) => {
  if (date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)) {
    return date.toISOString()
  }
  return date
}

const getTimezone = (date) => {
  const pattern = new RegExp('(Z|[+-](0[0-9]|1[0-9]|2[0-4]):?([0-5][0-9])?)$')
  date = toString(date)
  return date.match(pattern)[0]
}

module.exports = (data, coord) => {
  let ActivityStartTimestamp = null
  let ActivityStartTimeZone = null
  let ActivityEndTimestamp = null
  let ActivityEndTimeZone = null
  let AnalysisStartTimestamp = null
  let AnalysisStartTimeZone = null

  const [x,y] = coord

  const MonitoringLocationTimeZone = tzlookup(y, x)

  if (data.ActivityStartDate) {
    data.ActivityStartTime = padTime(data.ActivityStartTime)
    if (isValidDate(`${data.ActivityStartDate}T${data.ActivityStartTime}`)) {
      ActivityStartTimestamp = toDate(`${data.ActivityStartDate}T${data.ActivityStartTime}`,{timeZone:MonitoringLocationTimeZone})
      ActivityStartTimeZone = getTimezone(ActivityStartTimestamp)
    } else {
      console.error(
        'ActivityStartTimestamp Invalid',
        `${data.ActivityStartDate}T${data.ActivityStartTime}`, y, x
      )
    }
  }

  if (data.ActivityEndDate) {
    data.ActivityEndTime = padTime(data.ActivityEndTime)
    if (isValidDate(`${data.ActivityEndDate}T${data.ActivityEndTime}`)) {
      ActivityEndTimestamp = toDate(`${data.ActivityEndDate}T${data.ActivityEndTime}`,{timeZone:MonitoringLocationTimeZone})
      ActivityEndTimeZone = getTimezone(ActivityEndTimestamp)
    } else {
      console.error(
        'ActivityEndTimestamp Invalid',
        `${data.ActivityEndDate}T${data.ActivityEndTime}`, y, x
      )
    }
  }
  if (data.AnalysisStartDate) {
    data.AnalysisStartTime = padTime(data.AnalysisStartTime)
    if (
      isValidDate(
        `${data.AnalysisStartDate}T${data.AnalysisStartTime}${data.AnalysisStartTimeZone || 'Z'}`
      )
    ) {
      AnalysisStartTimestamp = `${data.AnalysisStartDate}T${data.AnalysisStartTime}${data.AnalysisStartTimeZone || 'Z'}`
      AnalysisStartTimeZone = data.AnalysisStartTimeZone || 'Z'
    } else {
      console.error(
        'AnalysisStartTimestamp Invalid',
        `${data.AnalysisStartDate}T${data.AnalysisStartTime}${data.AnalysisStartTimeZone || 'Z'}`, y,x
      )
    }
  }

  // zero out time offsets, stored as interval
  if (ActivityStartTimeZone === 'Z') ActivityStartTimeZone = '00:00:00'
  if (ActivityEndTimeZone === 'Z') ActivityEndTimeZone = '00:00:00'
  if (AnalysisStartTimeZone === 'Z') AnalysisStartTimeZone = '00:00:00'

  return {
    MonitoringLocationTimeZone,
    ActivityStartTimestamp,
    ActivityStartTimeZone,
    ActivityEndTimestamp,
    ActivityEndTimeZone,
    AnalysisStartTimestamp,
    AnalysisStartTimeZone
  }
}
