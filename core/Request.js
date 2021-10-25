/**
 * @doc true
 * @fileDoc true
 * @author xupengfei
 * @name Request.js
 * @type core
 * @desc axios extend, return axios instance
 */
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_BASEURL
const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
export default instance
