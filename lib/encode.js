// const encoding = require('encoding')

// https://www.i18nqa.com/debug/utf8-debug.html
const unicodeMapping = {
  '%u20AC': '%80', // €
  '%u201A': '%82', // ‚
  '%u0192': '%83', // ƒ
  '%u201E': '%84', // „
  '%u2026': '%85', // …
  '%u2020': '%86', // †
  '%u2021': '%87', // ‡
  '%u02C6': '%88', // ˆ
  '%u2030': '%89', // ‰
  '%u0160': '%8A', // Š
  '%u2039': '%8B', // ‹
  '%u0152': '%8C', // Œ
  '%u017D': '%8E', // Ž
  '%u2018': '%91', // ‘
  '%u2019': '%92', // ’
  '%u201C': '%93', // “
  '%u201D': '%94', // ”
  '%u2022': '%95', // •
  '%u2013': '%96', // –
  '%u2014': '%97', // —
  '%u02DC': '%98', // ˜
  '%u2122': '%99', // ™
  '%u0161': '%9A', // š
  '%u203A': '%9B', // ›
  '%u0153': '%9C', // œ
  '%u017E': '%9E', // ž
  '%u0178': '%9F' // Ÿ
}

const charMapping = {}
for (let i = 161; i < 255; i++) {
  const char = String.fromCharCode(i)
  charMapping[encodeURIComponent(char)] = escape(char)
}

const convertEncoding = (str) => {
  if (!str) return str
  str = escape(str)
  Object.keys(unicodeMapping).forEach((key) => {
    str = str.replace(key, unicodeMapping[key])
  })
  Object.keys(charMapping).forEach((key) => {
    str = str.replace(key, charMapping[key])
  })
  str = unescape(str)
  return str.trim()
}

module.exports = convertEncoding
