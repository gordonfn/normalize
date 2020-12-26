const math = require('./math')
const molarMass = require('molarmass')

const normalize = {
  // TODO
  Ammonia: '', // as N, as NH3, as NH4
  Nitrate: '', // as N, as NO3
  Nitrite: '', // as N, as NO2
  Orthophosphate: '', // as P, as PO4
  Phosphorus: '', // as P, as PO4
  Sulfate: '', // as S, as SO4
  'Total Phosphorus, mixed forms': '', // as P, as PO4
  'Total hardness': '' // as CaCO3, as CO3
}

module.exports = (characteristic, methodSpeciation, measure) => {
  if (
    typeof measure !== 'number' ||
    !isFinite(measure) ||
    !methodSpeciation ||
    methodSpeciation === 'Unspecified' ||
    !normalize[characteristic]
  ) { return [methodSpeciation, measure] }

  const normalizedMethodSpeciation = normalize[characteristic]

  const fromMolarMass = molarMass(methodSpeciation.replace(/^as/, '').trim())
  const toMolarMass = molarMass(
    normalizedMethodSpeciation.replace(/^as/, '').trim()
  )

  measure = math.evaluate(`${measure}*(${toMolarMass}/${fromMolarMass})`)
  return [normalizedMethodSpeciation, measure]
}
