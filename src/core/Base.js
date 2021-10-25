import { ElLoading as Loading } from 'element-plus/es/components/loading'
import { nextTick, render } from 'vue'
import { ElMessageBox as MessageBox } from 'element-plus/es/components/message-box'
import { ElMessage as Message } from 'element-plus/es/components/message'
import Emitter from 'tiny-emitter'
export const EventBus = new Emitter()
let loading
let loadingTxtDom

/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name Base.js
 * @type core
 * @desc vue3 and element-plus extend
 */
class Base {
  /**
   * @doc true
   * @name init
   * @desc extend vue3 instance method
   * 1. $destroy vue2's $destory method
   * 2. $baseEventBus global eventbus
   * 3. $baseLoading show full screen loading
   * 4. $baseLoadingText set inner text of full screen loading
   * 5. $baseLoadingClose close full screen loading
   * 6. $baseMessage show message box
   * 7. $baseAlert show alert
   * 8. $baseConfirm show confirm
   * @param app vue3 instance like const app = createApp()
   */
  init(app) {
    app.config.globalProperties.$destroy = function () {
      render(null, {
        _vnode: this.$.vnode
      })
    }
    app.config.globalProperties.$baseEventBus = EventBus
    app.config.globalProperties.$baseLoadingClose = this.LoadingClose
    app.config.globalProperties.$baseLoadingText = this.LoadingText
    app.config.globalProperties.$baseLoading = this.Loading
    app.config.globalProperties.$baseMessage = this.#Message
    app.config.globalProperties.$baseAlert = this.Alert
    app.config.globalProperties.$baseConfirm = this.#Confirm
  }

  /**
   * @doc true
   * @name LoadingClose
   * @desc full screen loading close
   * @constructor
   */
  LoadingClose() {
    loading && loading.close()
    loadingTxtDom = null
  }

  /**
   * @doc true
   * @name LoadingText
   * @desc set loading's innerHtml
   * @param str loading's innerHtml
   * @constructor
   */
  LoadingText(str) {
    if (loadingTxtDom) {
      loadingTxtDom.innerHTML = str
    }
  }

  /**
   * @doc true
   * @name Loading
   * @desc show full screen loading
   * @param text loading's innerHtml
   * @returns loading instance
   * @constructor
   */
  Loading(text) {
    loading && loading.close()
    loading = Loading.service({
      lock: true,
      text: text || '加载中...',
      background: 'hsla(0,0%,100%,.8)',
      customClass: 'Base-Loading'
    })
    nextTick().then(() => {
      const LoadDiv = document.querySelector('.Base-Loading')
      loadingTxtDom = LoadDiv.querySelector('.el-loading-text')
    })
    return loading
  }

  #Message(message, type = 'success') {
    return new Promise((resolve) => {
      Message({
        offset: 60,
        showClose: true,
        message: message,
        type: type,
        dangerouslyUseHTMLString: true,
        duration: 3000,
        onClose: () => {
          resolve(...arguments)
        }
      })
    })
  }

  /**
   * @doc true
   * @name MessageSuccess
   * @desc show success messageBox
   * @param message message box's info
   * @returns {Promise<unknown>}
   * @constructor
   */
  MessageSuccess(message) {
    return this.#Message(message, 'success')
  }

  /**
   * @doc true
   * @name MessageWarning
   * @desc show warning messageBox
   * @param message message box's info
   * @returns {Promise<unknown>}
   * @constructor
   */
  MessageWarning(message) {
    return this.#Message(message, 'warning')
  }

  /**
   * @doc true
   * @name MessageInfo
   * @desc show info messageBox
   * @param message message box's info
   * @returns {Promise<unknown>}
   * @constructor
   */
  MessageInfo(message) {
    return this.#Message(message, 'info')
  }

  /**
   * @doc true
   * @name MessageError
   * @desc show error messageBox
   * @param message message box's info
   * @returns {Promise<unknown>}
   * @constructor
   */
  MessageError(message) {
    return this.#Message(message, 'error')
  }

  /**
   * @doc true
   * @name Alert
   * @desc show alert
   * @param content alert's content
   * @param title alert's title
   * @returns {Promise<unknown>}
   * @constructor
   */
  Alert(content, title = '温馨提示') {
    return MessageBox.alert(content, title, {
      confirmButtonText: '确定',
      dangerouslyUseHTMLString: true
    })
  }

  #Confirm(content, title, type = 'info') {
    return MessageBox.confirm(content, title || '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      type: type
    })
  }

  /**
   * @doc true
   * @name ConfirmSuccess
   * @desc show confirm with success icon
   * @param content confirm's content
   * @param title confirm's title
   * @returns {Promise<unknown>}
   * @constructor
   */
  ConfirmSuccess(content, title = '温馨提示') {
    return this.#Confirm(content, title, 'success')
  }

  /**
   * @doc true
   * @name ConfirmError
   * @desc show confirm with error icon
   * @param content confirm's content
   * @param title confirm's title
   * @returns {Promise<unknown>}
   * @constructor
   */
  ConfirmError(content, title = '温馨提示') {
    return this.#Confirm(content, title, 'error')
  }

  /**
   * @doc true
   * @name ConfirmError
   * @desc show confirm with info icon
   * @param content confirm's content
   * @param title confirm's title
   * @returns {Promise<unknown>}
   * @constructor
   */
  ConfirmInfo(content, title = '温馨提示') {
    return this.#Confirm(content, title, 'info')
  }

  /**
   * @doc true
   * @name ConfirmError
   * @desc show confirm with warning icon
   * @param content confirm's content
   * @param title confirm's title
   * @returns {Promise<unknown>}
   * @constructor
   */
  ConfirmWarning(content, title = '温馨提示') {
    return this.#Confirm(content, title, 'warning')
  }
}

export default new Base()
