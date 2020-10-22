/*
Builds `calc/normalize.json`
 */
const path = require('path')
const promisify = require('util').promisify
const fs = require('fs')
const guidelines = require('@gordonfn/guidelines').metadataArray
const {uglify} = require('../lib/units')

const json = {
  characteristics: {
    'acenaphthene': 'ng/L',
    'acenaphthylene': 'ng/L',
    'Alkalinity, Total': 'mg/L',
    'Aluminum': 'ug/L',
    'Ammonia': 'mg/L',
    'Anthracene': 'ng/L',
    'Antimony': 'ug/L',
    'Arsenic': 'ug/L',
    'Barium': 'ug/L',
    'Benz[a]anthracene': 'ng/L',
    'Benzo(b)fluoranthene': 'ng/L',
    'Benzo[a]pyrene': 'ng/L',
    'Benzo[ghi]perylene': 'ng/L',
    'Benzo[k]fluoranthene': 'ng/L',
    'Beryllium': 'ug/L',
    'biphenyl': 'ng/L',
    'C1-Chrysenes': 'ng/L',
    'C1-Fluoranthenes/pyrenes': 'ng/L',
    'C1-Naphthalene': 'ng/L',
    'C1-Phenanthrenes/anthracenes': 'ng/L',
    'C2-Chrysenes': 'ng/L',
    'C2-Dibenzothiophenes': 'ng/L',
    'C2-Fluoranthenes/pyrenes': 'ng/L',
    'C2-Fluorenes': 'ng/L',
    'C2-Naphthalenes': 'ng/L',
    'C2-Phenanthrenes/anthracenes': 'ng/L',
    'C3-Chrysenes': 'ng/L',
    'C3-Dibenzothiophenes': 'ng/L',
    'C3-Fluoranthenes/pyrenes': 'ng/L',
    'C3-Fluorenes': 'ng/L',
    'C3-Naphthalenes': 'ng/L',
    'C3-Phenanthrenes/anthracenes': 'ng/L',
    'C4-Chrysenes': 'ng/L',
    'C4-Dibenzothiophenes': 'ng/L',
    'C4-Fluoranthenes/pyrenes': 'ng/L',
    'C4-Fluorenes': 'ng/L',
    'C4-Naphthalenes': 'ng/L',
    'C4-Phenanthrenes/anthracenes': 'ng/L',
    Cadmium: 'ug/L',
    Calcium: 'mg/L',
    Cesium: 'ug/L',
    Chloride: 'mg/L',
    'Chlorophyll a': 'mg/L',
    Chromium: 'ug/L',
    Chrysene: 'ng/L',
    Cobalt: 'ug/L',
    Copper: 'ug/L',
    'Depth, Secchi disk depth': 'm',
    'Dibenz(a,h)anthracene': 'ng/L',
    Dibenzothiophene: 'ng/L',
    'Dibenzothiophene (C1-C3)': 'ng/L',
    Fluoranthene: 'ng/L',
    fluorene: 'ng/L',
    Fluoride: 'mg/L',
    'Indeno[1,2,3-cd]pyrene': 'ng/L',
    Iron: 'ug/L',
    Lead: 'ug/L',
    Lithium: 'ug/L',
    Magnesium: 'mg/L',
    Manganese: 'ug/L',
    Mercury: 'ug/L',
    Methylfluorene: 'ng/L',
    'Methylmercury(1+)': 'ng/L',
    Molybdenum: 'ug/L',
    Naphthalene: 'ng/L',
    Nickel: 'ug/L',
    Nitrate: 'mg/L',
    Nitrite: 'mg/L',
    Nitrogen: 'mg/L',
    'Organic carbon': 'mg/L',
    pH: '',
    Phenanthrene: 'ng/L',
    Phosphorus: 'mg/L',
    Potassium: 'mg/L',
    Pyrene: 'ng/L',
    Rubidium: 'ug/L',
    Selenium: 'ug/L',
    Silver: 'ug/L',
    Sodium: 'mg/L',
    'Specific conductance': 'uS/cm',
    'Specific UV Absorbance at 254 nm': 'L/mg-cm',
    'Specific UV Absorbance at 254 nm, corrected for Fe': 'L/mg-cm',
    Strontium: 'ug/L',
    Sulfate: 'mg/L',
    'Temperature, sample': 'deg C',
    'Temperature, water': 'deg C',
    Thallium: 'ug/L',
    Titanium: 'ug/L',
    'Total dissolved solids': 'mg/L',
    'Total Hardness': 'mg/L',
    'Total suspended solids': 'mg/L',
    Turbidity: 'NTU',
    Uranium: 'ug/L',
    Vanadium: 'ug/L',
    Zinc: 'ug/L',
    'Dissolved oxygen (DO)': 'mg/L',
    'Temperature, air': 'deg C',
    'Hardness, Ca, Mg': 'mg/L',
    'Hardness, carbonate': 'mg/L',
    'Hardness, non-carbonate': 'mg/L',
    'Hardness, Calcium': 'mg/L',
    'Hardness, magnesium': 'mg/L'
  },
  groupings: {
    "Inorganics, Major, Metals": ["ug/L","umol/L","%"],
    "Inorganics, Major, Non-metals": ["ug/L","umol/L","%"],
    "Inorganics, Minor, Metals": ["ug/L","umol/L","%"],
    "Inorganics, Minor, Non-metals": ["ug/L","umol/L","%"],
    "Major ions": ["mg/L","umol/L","%"],
    "Nutrient": ["mg/L","umol/L","%"],
    "Organics, Other": ["ng/L","umol/L","%"],
    "Organics, Pesticide": ["ng/L","umol/L","%"],
    "Organics, PCBs": ["ng/L","umol/L","%"],
    "Biological": ["mg/L","umol/L","%"],
    "Information": ["m"],
    "Microbiological": ["MPN"],
    "Not Assigned": ["mg/L","umol/L","%", "m3/sec"],
    "Physical": ["mg/L","umol/L","%", "deg C", "m/sec", "mL", "TCU", "NTU", ""],
    "Radiochemical": ["pCi/L"],
    "Stable Isotopes": ["mg/L","umol/L","%"]
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
    path.join(__dirname, '..', 'calc/normalize.json'),
    JSON.stringify(json, null, 2)
  )

  console.log('Done')
  process.exit(0)
}

run()
