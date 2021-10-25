const Docs = require('./Docs.js')

/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name Route.js
 * @type core
 * @desc simple http router
 */
class Router {
  constructor(req, res) {
    this.req = req
    this.res = res
    this.url = this.req._url
    this.params = this.req.params
    this.handle()
  }

  handle() {
    const routes = this.url.pathname.split('/').filter((p) => {
      return p.length > 0
    })

    switch (routes[0]) {
      case undefined:
      case '':
        break
      case 'docs':
        this.res.setHeader('Content-Type', 'application/json;charset=UTF-8')
        const doc = new Docs(this.params.src).getDoc()
        this.end(JSON.stringify(doc))
        return
      default:
        break
    }
    this.end('Not Found', '404')
  }

  end(info, code = 200) {
    this.res.write(info)
    this.res.statusCode = code
    this.res.end()
  }
}
module.exports = Router
