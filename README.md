# uri-template-route

This package uses [URI Templates](https://tools.ietf.org/html/rfc6570) for conditional middleware calls.

## Usage

`uri-template-route` is a factory which returns new middlewares.
Call it with a URI Template and the middleware function, which should be conditionally called.
The template must be given as `String` or `uri-templates` object.
If the request URL matches the template, the middleware function is called.
Template variables will be assigned to `req.params`.

```
const uriTemplateRoute = require('uri-template-route')

const app = express()

app.use(uriTemplateRoute('/my-uri-template{?}', (req, res, next) => {
  // will be only called if req.url matches the template
  console.log(req.params)
})
```
