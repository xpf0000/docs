import App from './App.vue'
import 'element-plus/theme-chalk/index.css'
import { VueExtend } from './core/VueExtend.js'

console.log('import.meta.env.VITE_API_BASEURL: ', import.meta.env.VITE_API_BASEURL)
console.log('import.meta.env.VITE_DOC_SRC: ', import.meta.env.VITE_DOC_SRC)
const app = VueExtend(App)
app.mount('#app')
