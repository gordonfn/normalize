const { create, all } = require('mathjs')
const math = create(all, {
  number: 'BigNumber'
})

math.isValid = (value) => {
  return Number(value) === value && Number.isFinite(value)
}

module.exports = math
