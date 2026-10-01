module.exports = async (request, response) => {
  const { default: handler } = await import('../../client/api/uploads/signature.js')
  return handler(request, response)
}
