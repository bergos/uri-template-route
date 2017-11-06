const uriTemplate = require('uri-templates')

function middleware (template, route, req, res, next) {
  if (template.test(req.url)) {
    req.params = template.fromUri(req.url)

    route(req, res, next)
  } else {
    next()
  }
}

function factory (template, route) {
  if (typeof template === 'string') {
    template = uriTemplate(template)
  }

  return middleware.bind(null, template, route)
}

module.exports = factory
