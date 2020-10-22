const proj4 = require('proj4')

// https://spatialreference.org
proj4.defs([
  ['EPSG:3347', '+proj=lcc +lat_1=49 +lat_2=77 +lat_0=63.390675 +lon_0=-91.86666666666666 +x_0=6200000 +y_0=3000000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs'],  // NAD83 / Statistics Canada Lambert
  ['EPSG:4138', '+proj=longlat +ellps=clrk66 +no_defs'],
  ['EPSG:4139', '+proj=longlat +ellps=clrk66 +towgs84=11,72,-101,0,0,0,0 +no_defs'],
  ['EPSG:4169', '+proj=longlat +ellps=clrk66 +towgs84=-115,118,426,0,0,0,0 +no_defs'],
  ['EPSG:4267', '+proj=longlat +ellps=clrk66 +datum=NAD27 +no_defs'],
  ['EPSG:4269', '+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs'],
  ['EPSG:4322', '+proj=longlat +ellps=WGS72 +no_defs'],
  ['EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'],
  ['EPSG:4617', '+proj=longlat +ellps=GRS80 +no_defs'],
  ['EPSG:4675', '+proj=longlat +ellps=clrk66 +towgs84=-100,-248,259,0,0,0,0 +no_defs'],
  ['EPSG:4700', '+proj=longlat +ellps=clrk80 +no_defs'],
  ['EPSG:4725', '+proj=longlat +ellps=intl +towgs84=189,-79,-202,0,0,0,0 +no_defs'],
  //['EPSG:4733', '+proj=longlat +ellps=intl +towgs84=276,-57,149,0,0,0,0 +no_defs'],
  ['ESRI:37229', '+proj=longlat +a=6378270 +b=6356794.343434343 +no_defs'],
  ['EPSG:4957', '+proj=longlat +ellps=GRS80 +towgs84=-0.991,1.9072,0.5129,0.0257899075194932,-0.009650098960270402,-0.011659943232342112,0.0 +no_defs'],
])

// Duplicates
proj4.defs('EPSG:4135',  proj4.defs('EPSG:4138'))
proj4.defs('EPSG:4136',  proj4.defs('EPSG:4138'))
proj4.defs('EPSG:4137',  proj4.defs('EPSG:4138'))
proj4.defs('EPSG:4152',  proj4.defs('EPSG:4957'))
proj4.defs('EPSG:4956',  proj4.defs('EPSG:4957'))

// Aliases
proj4.defs('AMSMA', proj4.defs('EPSG:4169'))
proj4.defs('ASTRO', proj4.defs('EPSG:4700'))
proj4.defs('GUAM',  proj4.defs('EPSG:4675'))
proj4.defs('HARN',  proj4.defs('EPSG:4957'))
proj4.defs('JHNSN',  proj4.defs('EPSG:4725'))
proj4.defs('OLDHI',  proj4.defs('EPSG:4135'))
proj4.defs('PR',  proj4.defs('EPSG:4139'))
proj4.defs('SGEOR',  proj4.defs('EPSG:4138'))
proj4.defs('SLAWR',  proj4.defs('EPSG:4136'))
proj4.defs('SPAUL',  proj4.defs('EPSG:4137'))
proj4.defs('NAD27', proj4.defs('EPSG:4267'))
proj4.defs('NAD83', proj4.defs('EPSG:4269'))
//proj4.defs('WAKE',  proj4.defs('EPSG:4733'))
proj4.defs('WAKE',  proj4.defs('ESRI:37229'))
proj4.defs('WGS72', proj4.defs('EPSG:4322'))
proj4.defs('WGS84', proj4.defs('EPSG:4326'))

// Assumptions
proj4.defs('OTHER', proj4.defs('EPSG:4326'))
proj4.defs('UNKWN', proj4.defs('EPSG:4326'))

module.exports = (first, coord, round = 6) => proj4(first, 'EPSG:4326', coord)
  .map(v => Math.round(v * Math.pow(10, round)) / Math.pow(10, round))