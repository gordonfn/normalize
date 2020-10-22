
const {depth} = require('./measure')

module.exports = (first, measure, unit, coord) => {
  // coord for fallback lookup

  [measure, unit] = depth(measure, unit)

  // project(first) => datum
  const datum = first

  return [measure, unit, datum]
}