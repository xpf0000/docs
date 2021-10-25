#!/usr/bin/env node
/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name index.js
 * @type main
 * @desc project main file, create api server and run vue app with vite
 */
const fs = require('fs')
const path = require('path')
const http = require('http')
const Router = require('./src/core/Route.js')
const Docs = require('./src/core/Docs.js')
const compressing = require('compressing')

const argv = process.argv
if (!argv[2] || argv[2].trim() === '--build') {
  argv.splice(2, 0, path.join(__dirname, 'src'))
}

const src = argv[2]
process.env.VITE_DOC_SRC = src

const isBuild = argv[3] && argv[3].trim() === '--build'

if (isBuild) {
  const outDir = argv[4] ? argv[4] : path.join(__dirname, 'release')
  const zipfile = path.join(__dirname, 'pre-build.zip')
  compressing.zip
    .uncompress(zipfile, outDir)
    .then(() => {
      const doc = new Docs(src).getDoc()
      fs.writeFileSync(path.join(outDir, 'docs.json'), JSON.stringify(doc))
      console.log('Build Success: ', outDir)
    })
    .catch()
  return
}

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
argv.splice(1)
/**
 * @doc true
 * @name vue app
 * @desc run vue app with vite
 */
require('vite/dist/node/cli.js')
