const validate = require('@gordonfn/schema/json-schema/backend')

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
