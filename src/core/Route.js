const Docs = require('./Docs.js')
const handler = require('serve-handler')
const path = require('path')
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
      case 'docs.json':
        this.res.setHeader('Content-Type', 'application/json;charset=UTF-8')
        const doc = new Docs(process.env.DOC_SRC).getDoc()
        this.end(JSON.stringify(doc))
        return
      default:
        break
    }
    handler(this.req, this.res, {
      public: path.join(path.dirname(path.dirname(__dirname)), 'dist')
    })
  }

  end(info, code = 200) {
    this.res.write(info)
    this.res.statusCode = code
    this.res.end()
  }
}
module.exports = Router
