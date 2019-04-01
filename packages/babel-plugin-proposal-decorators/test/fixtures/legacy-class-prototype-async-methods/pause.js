module.exports = async function (ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}
