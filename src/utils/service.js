import axios from 'axios'
import store from '../store'
import { SHOWLOAD } from '../store/actions'

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 6000, //延迟时间
  headers: {}
})

//请求拦截器
service.interceptors.request.use(
  config => {
    store.dispatch(SHOWLOAD('true'))
    console.log('请求拦截器', store.getState().isload)
    let token = localStorage.getItem('token')
    if (token) {
      //如果有token
      config.headers.authoraiztion = token
    }
    return config
  },
  err => {
    //请求错误的回调
    return Promise.reject(err)
  }
)

//响应拦截器
service.interceptors.response.use(
  res => {
    store.dispatch(SHOWLOAD('false'))
    console.log('响应拦截器', store.getState().isload)
    return res
  },
  err => {
    return Promise.reject(err)
  }
)
export default service
