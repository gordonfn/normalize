const logs = []
module.exports = (...args) => {
  const str = args.join(args)
  if (logs.includes(str)) return
  logs.push(str)
  console.log(str)
}

const logMemory = (id = '') => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024
  console.log(`memory ${id} ${Math.round(used * 100) / 100} MB`)
}