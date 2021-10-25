/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name index.js
 * @type main
 * @desc project main file, create api server and run vue app with vite
 */
const http = require('http')
const Router = require('./core/Route.js')

const src = process.argv[2] || __dirname
process.env.VITE_DOC_SRC = src
let base = ''
/**
 * @doc true
 * @name api server
 * @desc project api server
 */
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  if (req.method.toLowerCase() === 'options') {
    res.statusCode = 200
    res.end()
    return
  }

  let post = ''
  req.on('data', function (chunk) {
    post += chunk
  })
  req.on('end', function () {
    post = JSON.parse(post || '{}')
    const get = {}
    const url = new URL(req.url, base)
    url.searchParams.forEach((value, name) => {
      get[name] = value
    })
    const params = { ...get, ...post }
    req.params = params
    req._url = url
    const router = new Router(req, res)
  })
})
server.on('listening', () => {
  const port = server.address().port
  console.log('port: ', port, `http://localhost:${port}/`)
  base = `http://localhost:${port}/`
  process.env.VITE_API_BASEURL = `http://localhost:${port}/`
})
server.listen(0)
process.argv.splice(1)
/**
 * @doc true
 * @name vue app
 * @desc run vue app with vite
 */
require('vite/dist/node/cli.js')
