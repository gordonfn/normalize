/*
Builds `calc/normalize.json`
 */
const path = require('path')
const promisify = require('util').promisify
const fs = require('fs')
const guidelines = require('@gordonfn/guidelines').metadataArray
const { uglify } = require('../lib/unit')
const parse = require('csv-parse/lib/sync')

const characteristics = {}
const data = fs.readFileSync(__dirname + '/normalize.csv')
const rows = parse(data, {
  columns: true,
  skip_empty_lines: true
})
for (const row of rows) {
  characteristics[row['Characteristic Name']] = row.Unit
}

const json = {
  characteristics,
  groupings: {
    'Inorganics, Major, Metals': ['ug/L', 'ug/g', 'umol/L', '%'],
    'Inorganics, Major, Non-metals': ['ug/L', 'ug/g', 'umol/L', '%'],
    'Inorganics, Minor, Metals': ['ug/L', 'ug/g', 'umol/L', '%'],
    'Inorganics, Minor, Non-metals': ['ug/L', 'ug/g', 'umol/L', '%'],
    'Major ions': ['mg/L', 'mg/kg', 'umol/L', '%'],
    Nutrient: ['mg/L', 'mg/kg', 'umol/L', '%'],
    'Organics, Other': ['ng/L', 'ng/kg', 'umol/L', '%'],
    'Organics, Pesticide': ['ng/L', 'ng/kg', 'umol/L', '%'],
    'Organics, PCBs': ['ng/L', 'ng/kg', 'umol/L', '%'],
    Biological: ['mg/L', 'mg/kg', 'umol/L', '%'],
    Information: ['m', 'm2'],
    Microbiological: ['MPN', '#/100mL', 'MPN/100mL', 'CFU/100mL'],
    Physical: [
      'mg/L',
      'mg/kg',
      'umol/L',
      'deg C',
      'm/s',
      'mL',
      'L/mg-m',
      'units/cm',
      'TCU',
      'm',
      'm2'
    ],
    Radiochemical: ['pCi/L', 'TU', 'permille', '%'],
    'Stable Isotopes': [
      'mg/L',
      'mg/kg',
      'umol/L',
      'pCi/L',
      'TU',
      'permille',
      '%'
    ],
    'Not Assigned': ['mg/L', 'mg/kg', 'umol/L', 'm3/s'],
    default: []
  }
}

// Test defaults list
guidelines.forEach((item) => {
  // console.log(item.characteristic_name, item.unit)
  if (
    json.characteristics[item.characteristic_name] &&
    json.characteristics[item.characteristic_name] !== uglify(item.unit)
  ) {
    console.log(
      item.characteristic_name,
      json.characteristics[item.characteristic_name],
      '->',
      uglify(item.unit)
    )
    json.characteristics[item.characteristic_name] = uglify(item.unit)
  }
})

const run = async () => {
  await promisify(fs.writeFile)(
    path.join(__dirname, '..', 'lib/normalize.json'),
    JSON.stringify(json, null, 2)
  )

  console.log('Done')
  process.exit(0)
}

run()
