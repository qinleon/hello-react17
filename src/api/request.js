/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-07-14 14:36:25
 * @LastEditors: Qleo
 * @LastEditTime: 2022-09-06 19:02:54
 */
import axios from 'axios'
import { message } from 'antd'
import { isAuthenticated } from '@src/utils/Session'
import { logout } from '@src/utils/Session.js'
import { casAuth } from '@src/utils/myContext.js'

// create an axios instance
const request = axios.create({
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
})

// request interceptor
request.interceptors.request.use(
  config => {
    config.headers['Authorization'] = isAuthenticated()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  response => {
    const res = response.data
    if (['0000', 200].includes(res.code)) {
      return res
    } else {
      console.log(res.code)
      if (res.code === 'E0105') {
        // 重新认证下
        logout()
        casAuth(window.location.origin)
      } else if (['C0104', 'C0100', 'C0101', 'C0102', 'C0103', 'C0001'].includes(res.code)) {
        logout()
        casAuth(window.location.origin)
      } else {
        message.error(res.message || 'Error')
      }
      return Promise.reject(res)
    }
  },
  error => {
    console.log('err' + error) // for debug
    message.error(error.message || 'Error')
    return Promise.reject(error)
  }
)

export default request
