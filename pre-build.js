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
const Docs = require('./src/core/Docs.js')

const argv = process.argv
const src = path.join(__dirname, 'src')
process.env.VITE_DOC_SRC = src

const doc = new Docs(src).getDoc()
fs.writeFileSync(path.join(__dirname, 'public', 'docs.json'), JSON.stringify(doc))
argv.splice(1)
argv.push('cli', 'build')
process.env.VITE_API_BASEURL = './'
require('vite/bin/vite.js')
