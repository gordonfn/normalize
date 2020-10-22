const { create, all } = require('mathjs')
const math = create(all, {
  number: 'BigNumber'
})

module.exports = math