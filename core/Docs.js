const { findFile, uuid } = require('./Utils.js')
const fs = require('fs')
const path = require('path')
const { trimEnd } = require('lodash')

/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name Docs.js
 * @type core
 * @desc get docs by location dir path
 */
class Docs {
  /**
   * @doc true
   * @name constructor
   * @param src location dir path
   */
  constructor(src) {
    this.src = trimEnd(src, '/') + '/'
    this.references = {}
    this.docs = {}
    this.cacheSet = new Set()
    this.make()
  }

  /**
   * make src's docs
   */
  make() {
    const allFile = findFile(this.src)
    allFile.forEach((file) => {
      this.#fileDocs(file)
    })
  }

  #getReferences(file) {
    const arr = []
    if (this.cacheSet.has(file)) {
      return arr
    }
    this.cacheSet.add(file)
    const references = this.references[file]
    if (references) {
      references.forEach((r) => {
        const obj = {
          file: r,
          children: this.#getReferences(r)
        }
        arr.push(obj)
      })
    }
    return arr
  }

  /**
   * @doc true
   * @name getDoc
   * @desc get docs group by @fileDoc and @type
   * @constructor
   */
  getDoc() {
    const docs = {}
    for (let key in this.docs) {
      let doc = this.docs[key]
      doc.file = key
      const type = doc.type || '默认分组'
      if (!docs[type]) {
        docs[type] = []
      }
      docs[type].push(doc)
    }
    const references = {}
    for (let key in this.references) {
      if (!references[key]) {
        references[key] = []
      }
      this.references[key].forEach((f) => {
        references[key].push(f)
      })
    }
    return { docs: docs, references: references }
  }

  #fileDocs(file) {
    const content = fs.readFileSync(file, 'utf-8')
    // 获取文件引用链-开始
    if (content.indexOf('import') >= 0 || content.indexOf('require') >= 0) {
      if (!this.references[file]) {
        this.references[file] = new Set()
      }
      // eslint-disable-next-line
      let reg = new RegExp('import\\(([\\s\\S]*?)\\)', 'g')
      let res
      while ((res = reg.exec(content)) != null) {
        // eslint-disable-next-line
        let pp = res[1].trim().replace(new RegExp(`'`, 'g'), '').replace(new RegExp(`"`, 'g'), '')
        if (pp.indexOf('@/') === 0) {
          pp = pp.replace('@/', this.src)
        } else if (pp.indexOf('.') === 0) {
          const base = path.dirname(file)
          pp = path.resolve(base, pp)
        } else {
          continue
        }
        this.references[file].add(pp)
      }
      reg = new RegExp('require\\(([\\s\\S]*?)\\)', 'g')
      while ((res = reg.exec(content)) != null) {
        // eslint-disable-next-line
        let pp = res[1].trim().replace(new RegExp(`'`, 'g'), '')
        if (pp.indexOf('@/') === 0) {
          pp = pp.replace('@/', this.src)
        } else if (pp.indexOf('.') === 0) {
          const base = path.dirname(file)
          pp = path.resolve(base, pp)
        } else {
          continue
        }
        this.references[file].add(pp)
      }
      // eslint-disable-next-line
      reg = new RegExp(`import([ \n{}a-zA-Z\d,]*?)from([ \n]*?)'(.*?)'`, 'g')
      while ((res = reg.exec(content)) != null) {
        let pp = res[3].trim()
        if (pp.indexOf('@/') === 0) {
          pp = pp.replace('@/', this.src)
        } else if (pp.indexOf('.') === 0) {
          const base = path.dirname(file)
          pp = path.resolve(base, pp)
        } else {
          continue
        }
        this.references[file].add(pp)
      }
    }
    // 获取文件引用链-结束

    // 生成文档-开始
    if (content.indexOf('@doc true') >= 0) {
      // eslint-disable-next-line
      let reg = new RegExp('/\\*\\*([\\s\\S]*?)\\*/', 'g')
      let res
      const fileDoc = {
        author: '',
        type: '',
        name: '',
        desc: '',
        docs: {
          default: []
        }
      }
      while ((res = reg.exec(content)) != null) {
        let str = res[1]
        const strArr = str
          .trim()
          .split('* @')
          .filter((s) => {
            return s.trim().length > 0
          })
          .map((s) => s.trim())
        const obj = {
          id: uuid(10)
        }
        for (let line of strArr) {
          const lineArr = line.split(' ')
          const key = lineArr.shift().replace('@', '')
          const value = lineArr.join(' ')
          const vtype = typeof obj[key]
          if (vtype === 'string') {
            obj[key] = [obj[key]]
            obj[key].push(value)
          } else if (vtype === 'object') {
            obj[key].push(value)
          } else {
            obj[key] = value
          }
        }
        if (obj.param && typeof obj.param === 'string') {
          obj.param = [obj.param]
        }
        if (obj.fileDoc) {
          Object.assign(fileDoc, obj)
        } else {
          if (obj.type) {
            if (!fileDoc.docs[obj.type]) {
              fileDoc.docs[obj.type] = []
            }
            fileDoc.docs[obj.type].push(obj)
          } else {
            fileDoc.docs.default.push(obj)
          }
        }
      }
      this.docs[file] = fileDoc
    }
    // 生成文档-结束
  }
}

module.exports = Docs
