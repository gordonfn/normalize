const schema = require('@gordonfn/schema/json-schema-legacy/index.json')
const Ajv = require('ajv')
const ajv = new Ajv({
  schemaId: 'auto',
  format: 'full',
  coerceTypes: true,
  allErrors: false, // reporting all is not required
  useDefaults: true
})
require('ajv-keywords')(ajv, ['transform'])
const validate = ajv.compile(schema)

module.exports = (data) => {
  // remove nulls, csv default is ''
  Object.keys(data).forEach(
    (key) => (data[key] === null || data[key] === '') && delete data[key]
  )
  const valid = validate(data)

  if (!valid) {
    console.error('Error: valid', data, validate.errors)
    throw new Error(validate.errors)
  }

  return data
}
