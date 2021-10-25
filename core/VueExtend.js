/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name VueExtend.js
 * @type core
 * @desc Factory method to create vue3 instance, with use vue's extend like element-plus vuex...
 */
import { createApp, toRaw, markRaw } from 'vue'
import Base from './Base.js'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'

/**
 * @doc true
 * @name VueExtend
 * @desc Factory method to create vue3 instance, with use vue's extend like element-plus vuex...
 * @param App vue template
 * @param data vue template data
 * @returns {App<Element>} vue3 instance
 * @constructor
 */
export function VueExtend(App, data = null) {
  const app = createApp(App, data)
  Base.init(app)
  app.use(ElementPlus, { size: 'medium', locale })
  app.mixin({
    beforeCreate() {
      this.$children = new Set()
      if (this?.$parent?.$children) {
        this.$parent.$children.add(this)
      }
    },
    created() {
      this._uid = this.$.uid
    },
    beforeUnmount() {
      if (this?.$parent?.$children && this.$parent.$children.has(this)) {
        this.$parent.$children.delete(this)
      }
      this.$children.clear()
      this.$children = null
    },
    unmounted() {},
    methods: {
      markRaw,
      toRaw
    }
  })
  return app
}
