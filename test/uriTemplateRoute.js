/* global describe, it */

const assert = require('assert')
const express = require('express')
const request = require('supertest')
const uriTemplateRoute = require('..')
const uriTemplate = require('uri-templates')

describe('uri-template-route', () => {
  it('should be a factory', () => {
    assert.equal(typeof uriTemplateRoute, 'function')
  })

  it('should return a middleware', () => {
    const middleware = uriTemplateRoute('/', () => {})

    assert.equal(typeof middleware, 'function')
    assert.equal(middleware.length, 3)
  })

  it('should continue of the template does not match', () => {
    let touched = false

    const app = express()

    app.use(uriTemplateRoute('/path', () => {
      touched = true
    }))

    return request(app)
      .get('/other-path')
      .then((res) => {
        assert(!touched)
      })
  })

  it('should call the middleware if the template string matches', () => {
    let touched = false

    const app = express()

    app.use(uriTemplateRoute('/path', (req, res, next) => {
      touched = true

      next()
    }))

    return request(app)
      .get('/path')
      .then((res) => {
        assert(touched)
      })
  })

  it('should call the middleware if the template matches', () => {
    let touched = false

    const app = express()

    app.use(uriTemplateRoute(uriTemplate('/path'), (req, res, next) => {
      touched = true

      next()
    }))

    return request(app)
      .get('/path')
      .then((res) => {
        assert(touched)
      })
  })

  it('should forward the request object', () => {
    let obj

    const app = express()

    app.use(uriTemplateRoute('/path', (req, res, next) => {
      obj = req

      next()
    }))

    return request(app)
      .get('/path')
      .then((res) => {
        assert.equal(obj.url, '/path')
      })
  })

  it('should forward the response object', () => {
    let obj

    const app = express()

    app.use(uriTemplateRoute('/path', (req, res, next) => {
      obj = res

      next()
    }))

    return request(app)
      .get('/path')
      .then((res) => {
        assert.equal(typeof obj.send, 'function')
      })
  })

  it('should forward the next object', () => {
    let obj

    const app = express()

    app.use(uriTemplateRoute('/path', (req, res, next) => {
      obj = next

      next()
    }))

    return request(app)
      .get('/path')
      .then((res) => {
        assert.equal(typeof obj, 'function')
      })
  })

  it('should assign the variables to res.params', () => {
    let obj

    const app = express()

    app.use(uriTemplateRoute('/path{?}', (req, res, next) => {
      obj = req.params

      next()
    }))

    return request(app)
      .get('/path?test=test')
      .then((res) => {
        assert.deepEqual(obj, {
          test: 'test'
        })
      })
  })
})
