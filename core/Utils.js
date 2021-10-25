/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name Utils.js
 * @type core
 * @desc global method extend
 */
const fs = require('fs')
const path = require('path')

/**
 * @doc true
 * @name findFile
 * @desc find all file by location dir path
 * @param base location dir path
 * @returns [] all file in location dir path
 */
const findFile = (base) => {
  const files = []
  fs.readdirSync(base).forEach((file) => {
    const curPath = path.join(base, file)
    if (fs.existsSync(curPath)) {
      const stat = fs.lstatSync(curPath)
      if (!stat.isSymbolicLink()) {
        if (stat.isFile()) {
          files.push(curPath)
        } else if (stat.isDirectory()) {
          const sub = findFile(curPath)
          files.push(...sub)
        }
      }
    }
  })
  return files
}

/**
 * @doc true
 * @name uuid
 * @desc make uuid string
 * @param length uuid string length
 * @returns string uuid string
 */
const uuid = (length = 32) => {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

module.exports = {
  findFile,
  uuid
}
