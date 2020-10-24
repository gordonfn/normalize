const { convertList, uglify, prettify } = require('./unit')
const units = require('./normalize.json')
const characteristicGroup = require('wqx/groups/CharacteristicName.json')
const log = require('./log')

const characteristic = (characteristic, measure = null, unit = null) => {
  if (!unit || unit === '') return [measure, unit]
  if (typeof measure !== 'number' || !isFinite(measure)) return [null, unit]  // non-measure

  let normalizedMeasure = measure
  let normalizedUnit
  let normalizedUnits = []

  const group = characteristicGroup[characteristic] || 'Not Assigned' // Not Assigned for our additions

  if (group === 'Not Assigned') log(group, '>', characteristic)

  if (units.characteristics[characteristic]) {
    normalizedUnits = normalizedUnits.concat([units.characteristics[characteristic]], units.groupings[group], units.groupings.default)
  } else {
    normalizedUnits = normalizedUnits.concat(units.groupings[group], units.groupings.default)
  }

  try {
    let normalized = convertList(
      measure,
      unit,
      normalizedUnits
    )

    normalizedMeasure = normalized[0]
    normalizedUnit = normalized[1]
  } catch (e) {
    normalizedUnit = uglify(unit)
    log(`Error: Failed to convert ${prettify(normalizedUnit)} to ${JSON.stringify(normalizedUnits)} for ${characteristic} in ${group}`)
  }

  normalizedUnit = prettify(normalizedUnit)
  return [normalizedMeasure, normalizedUnit]
}

const distance = (measure = null, unit = null) => {
  if (!unit || unit === '') return [measure, unit]
  if (typeof measure !== 'number' || !isFinite(measure)) return [null, unit]  // non-measure

  const endUnit = 'm'
  if (unit === endUnit) return [measure, unit]

  let normalizedMeasure = measure
  let normalizedUnit

  try {

    let normalized = convertList(
      measure,
      unit,
      [endUnit]
    )

    normalizedMeasure = normalized[0]
    normalizedUnit = normalized[1]

  } catch (e) {
    normalizedUnit = uglify(unit)
    log(`Error: Failed to convert ${unit} to ${JSON.stringify(normalizedUnit)}`)
  }

  normalizedUnit = prettify(normalizedUnit)
  return [normalizedMeasure, normalizedUnit]
}

module.exports = { characteristic, distance }
