const toDate = require('date-fns-tz').toDate
const formatISO = require('date-fns/formatISO')
const timezoneLookup = require('tz-lookup')

const getTimezone = (date) => {
  const pattern = new RegExp('(Z|[+-]([0-9]|0[0-9]|1[0-9]|2[0-4]):?([0-5][0-9]))$')
  date = toString(date)
  return date.match(pattern)[0]
}

// reformats older timezone formats ie -600 -> -06:00
const formatTimeZone = (time) => {
  if (!time) {
    return time
  }
  // -600 -> -6:00
  if (!time.includes(':')) {
    time = time.replace(/^([+-])([0-9]{1,2}):?([0-9]{2})$/, '$1$2:$3')
  }
  // -6:00 -> -06:00
  if (time.length !== 6) {
    time = time.replace(/^([+-])([0-9]):?([0-9]{2})$/, '$10$2:$3')
  }
  return time
}

// Need to pad time is short time format was used ie 8:30 -> 08:30
const padTime = (time) => {
  if (!time) {
    return time
  }
  return (time)
    .split(':')
    .map((t) => (t.length === 1 ? '0' + t : t))
    .join(':')
}

function isValidDate (str) {
  const d = new Date(str)
  return d instanceof Date && !isNaN(d)
}

const toString = (date) => {
  if (
    date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date)
  ) {
    return date.toISOString()
  }
  return date
}

module.exports = (data, coord) => {
  let ActivityStartTimestamp = null
  let ActivityStartTime = null
  let ActivityStartTimeZone = null
  let ActivityEndTimestamp = null
  let ActivityEndTime = null
  let ActivityEndTimeZone = null
  let AnalysisStartTimestamp = null
  let AnalysisStartTime = null
  let AnalysisStartTimeZone = null

  const [x, y] = coord

  const MonitoringLocationTimeZone = timezoneLookup(y, x)
  const dateOptions = { timeZone: MonitoringLocationTimeZone }

  ActivityStartTime = padTime(data.ActivityStartTime)
  if (data.ActivityStartDate) {
    if (isValidDate(`${data.ActivityStartDate}T${ActivityStartTime}`)) {
      ActivityStartTimestamp = formatISO(
        toDate(
          `${data.ActivityStartDate}T${ActivityStartTime}`,
          dateOptions
        ),
        dateOptions
      )
      ActivityStartTimeZone = getTimezone(ActivityStartTimestamp)
      if (ActivityStartTimeZone === 'Z') ActivityStartTimeZone = '+00:00'
    } else {
      console.error(
        'ActivityStartTimestamp Invalid',
        `${data.ActivityStartDate}T${data.ActivityStartTime}`,
        y,
        x
      )
    }
  }

  ActivityEndTime = padTime(data.ActivityEndTime)
  if (data.ActivityEndDate) {
    if (isValidDate(`${data.ActivityEndDate}T${ActivityEndTime}`)) {
      ActivityEndTimestamp = formatISO(
        toDate(`${data.ActivityEndDate}T${ActivityEndTime}`, dateOptions),
        dateOptions
      )
      ActivityEndTimeZone = getTimezone(ActivityEndTimestamp)
      if (ActivityEndTimeZone === 'Z') ActivityEndTimeZone = '+00:00'
    } else {
      console.error(
        'ActivityEndTimestamp Invalid',
        `${data.ActivityEndDate}T${data.ActivityEndTime}`,
        y,
        x
      )
    }
  }

  AnalysisStartTime = padTime(data.AnalysisStartTime)
  AnalysisStartTimeZone = formatTimeZone(data.AnalysisStartTimeZone)
  if (AnalysisStartTimeZone === 'Z') AnalysisStartTimeZone = '+00:00'

  return {
    MonitoringLocationTimeZone,
    ActivityStartTime,
    ActivityStartTimeZone,
    ActivityEndTime,
    ActivityEndTimeZone,
    AnalysisStartTime,
    AnalysisStartTimeZone
  }
}
