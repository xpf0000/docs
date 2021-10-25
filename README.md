# Docs

Generate documents from standard comments, Not limited to specific files, specific languages

group by user custom, show file's dependencies chain that used by import and require

# How it works

Traverse all files in the directory, find all standard comments like /* */

Resolve specific tags starting with @, like @author @name @desc @type

Resolve import and require to get file's dependencies chain

# Comment Example

```js
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

```

# Comment Tags

### @doc

is parse to doc

### @fileDoc

Documentation of the entire file

### @type

comment doc's type, doc's group by this

### @author

current comment doc's author

### @name

file's name, method's name, ... 

### @desc

current comment doc's desc

### @param

current comment doc's param

### @returns

current comment doc's returns


