const math = require('./math')

// Docs: https://mathjs.org/docs/datatypes/units.html
// SI Units https://en.wikipedia.org/wiki/International_System_of_Units

const unconvertible = [
  'count', // Number of items
  'percent', // Percent
  'CFU', // colony-forming-unit
  'CTU', // ??
  'FTU', // Formazin Turbidity Unit
  'FNU', // Formazin Nephelometric Unit
  'MPN', // Most probable number = CFU??
  'TU', // Tritium Unit
  'REL', // ?? used w/ True color
  'AU', // Apparent Unit for Color
  'RFU', // relative fluorescence unit
  'units', // ?? // units/cm
  'Deg' // DELETE!!
]
unconvertible.forEach((unit) => math.createUnit(unit))

// aliases
math.createUnit('d', '1 day')
math.createUnit('wk', '1 week')
math.createUnit('mo', '1 month')
math.createUnit('y', '1 year')
math.createUnit('one', '1')
math.createUnit('five', '5')
math.createUnit('ten', '10')
math.createUnit('hundred', '100')
math.createUnit('thousand', '1000')

math.createUnit('NTU', `${1 / 3}3 mg/L`) // Nephelometric turbidity unit

math.createUnit('HU') // Hazen Unit
math.createUnit('PCU', '1 HU') // Platinum Cobalt Unit
math.createUnit('TCU', '1 HU') // True Colour Unit
math.createUnit('CU', '1 HU') // Colour Unit
math.createUnit('JTU', '1 mg/l') // Jackson Turbidity Unit

math.createUnit('permille', '1 g/L') // Part-per Thousand
math.createUnit('ppm', '0.001 g/L') // Part-per Million
math.createUnit('ppb', '0.000001 g/L') // Part-per Billion
math.createUnit('ppt', '0.000000001 g/L') // Part-per Trillion

// Becquerel (SI) / Curie
math.createUnit('Bq')
math.createUnit('Ci', '37000000000 Bq')
math.createUnit('mCi', '0.001 Ci')
math.createUnit('uCi', '0.000001 Ci')
math.createUnit('nCi', '0.000000001 Ci')
math.createUnit('pCi', '0.000000000001 Ci')

// equivalents
math.createUnit('eq')
math.createUnit('meq', '0.001 eq')
math.createUnit('ueq', '0.000001 eq')
math.createUnit('neq', '0.000000001 eq')
math.createUnit('peq', '0.000000000001 eq')

// Ohm
math.createUnit('mho', '1 S')
math.createUnit('mmho', '0.001 mho')
math.createUnit('umho', '0.000001 mho')
math.createUnit('nmho', '0.000000001 mho')
math.createUnit('pmho', '0.000000000001 mho')

// atm
math.createUnit('matm', '0.001 atm')
math.createUnit('uatm', '0.000001 atm')
math.createUnit('natm', '0.000000001 atm')
math.createUnit('patm', '0.000000000001 atm')

const convert = (value, unit, endUnit) => {
  if (typeof value === 'undefined') value = null
  if (value === null) return value

  unit = uglify(unit)
  endUnit = uglify(endUnit)

  if (unit === endUnit || !unit || !endUnit) return value

  if ([unit, endUnit].includes('%')) throw new Error('Units do not match %')

  return math.unit(`${value} ${unit}`).toNumber(endUnit)
}

const convertList = (value, unit, endUnits) => {
  if (!endUnits.length) { throw new Error('Failed, no end units remaining, using', unit) }
  unit = uglify(unit)
  if (value === null) return [value, unit]

  if (!Array.isArray(endUnits)) endUnits = [endUnits]
  endUnits = endUnits.map((u) => uglify(u))
  // if already in an allowed unit or cannot be converted
  if (endUnits.includes(unit) || unconvertible.includes(unit)) { return [value, unit] }
  const endUnit = endUnits.shift()

  if (unit === endUnit || !unit || !endUnit) return [value, unit]

  try {
    return [convert(value, unit, endUnit), endUnit]
  } catch (e) {
    if (!e.message.includes('Units do not match')) console.error(e.message)
    return convertList(value, unit, endUnits)
  }
}

// TODO add in replaceAll polyfill
// Convert to allow math.js conversion
const uglify = (unit) => {
  if (!unit) return ''

  if (['Granules', 'Imp gal', 'ADMI value'].includes(unit)) return unit

  return (
    unit
      .replace('None', '')
      .replace(/CaCO3/g, '')

      .replace(/(.*)-(\d+)/g, '$2/$1') // ie a-1 -> 1/a NOTE might not work for -1000

      // Bad units - fix in schema
      .replace('ha', 'hectare')
      .replace('ATM', 'atm')
      .replace('cfu', 'CFU')
      .replace('Mole', 'mol')
      .replace('volts', 'V')
      .replace('Watts', 'W')
      .replace('mEq/100g', 'meq/100g')
      .replace('kw', 'kW')
      .replace('KOhm/cm', 'kohm/cm')
      .replace('mg N/l', '(mg*N)/L')

      // time, also bad units
      .replace('sec', 's')
      .replace('hours', 'h')
      .replace('hour', 'h')
      .replace('hr', 'h')
      .replace('days', 'd')
      .replace('day', 'd')
      .replace('dy', 'd')
      .replace('weeks', 'wk')
      .replace('mnth', 'mo')
      .replace('months', 'mo')
      .replace('years', 'y')
      .replace('year', 'y')
      .replace('yr', 'y')

      // misc To words
      .replace('0/00', 'permille')
      .replace('per mil', 'permille')
      .replace('per m', 'm2')
      .replace('#', 'count') // #/100mL
      .replace(/%(.*)/, 'percent') // %
      .replace(/1000(.+?)/, 'one*thousand*$1')
      .replace(/100(.+?)/, 'one*hundred*$1') // #/100mL
      .replace(/500(.+?)/, 'five*hundred*$1')
      .replace(/10(.+?)/, 'ten*$1')
      .replace(/1(.+?)/, 'one*$1')
      .replace(/\/m(l|L)/, '/one*mL') // Special case (#/mL <=> #/100mL)

      // Symbol to chars
      .replace('°', 'deg')
      .replace('²', '2')
      .replace('₂', '2')
      .replace('³', '3')
      .replace('₃', '3')
      .replace('Ω', 'ohm')
      .replace('℧', 'mho')
      .replace('·', '*')
      .replace('µ', 'u')
      .replace(/(.*)⁻¹/, '1/$1')

      // string to chars
      .replace('Joules', 'J')
      .replace('lumens', 'lm')
      .replace('candles', 'c')
      .replace('lbs', 'lb')
      .replace('mhos', 'mho') // mmhos/cm
      .replace('HZN', 'HU') // Hazen Unit

      // patterns
      .replace(/\s+/g, '') // units are not allowed to have a space
      .replace(/\/(.+)-(.+)/, '/($1*$2)') // ie L/mg-cm == L/(mg-cm), NOTE may not be true for all
      .replace(/^\(([^\(\)]+)\)$/, '$1')
  ) // remove entire wrapper
}

const prettify = (unit) => {
  if (!unit || unit === 'None') return ''
  if (['Granules', 'Imp gal', 'ADMI value'].includes(unit)) return unit

  return unit
    .replace('deg', '°')
    .replace('mho', '℧')
    .replace('ohm', 'Ω')

    .replace('count/', '#/') // #/100mL
    .replace('percent', '%')
    .replace('permille', '‰')
    .replace(/one[*]?/, '1')
    .replace(/five[*]?/, '5')
    .replace(/ten[*]?/, '10')
    .replace(/hundred[*]?/, '00')
    .replace(/thousand[*]?/, '000')
    .replace(/1([^\d]+)/, '$1')

    .replace(/(?<!%)(?<!by)(?<!per) (?!DW)(?!ton)(?!Ca)(?!cnt)/g, '')
    .replace(/(^|\/|m|u)l$/g, '$1L')
    .replace(/u(ATM|g|l|L|mol|m|S|W)/g, 'µ$1')

    .replace(/H2O/g, 'H₂O')
    .replace(/(ft|in|yd|m|mi)2/g, '$1²')
    .replace(/(ft|in|yd|m|mi)3/g, '$1³')
    .replace(/(.*)-1$/g, '$1⁻¹')

    .replace(/[-\*]/g, '·')
}

module.exports = { math, convert, convertList, prettify, uglify }
