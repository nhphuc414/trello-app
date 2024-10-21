export default (asyncMiddleware) => (req, res, next) => {
  Promise.resolve(asyncMiddleware(req, res, next)).catch(next)
}
