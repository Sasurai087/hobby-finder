// This is a function that ACCEPTS another function, executes the passed function ,then passes it to Express
// Use this to wrap async functions, replacing the usual try-catch blocks

module.exports = func => {
  return (req, res, next)  => {
    func(req, res, next).catch(next)
  }
}