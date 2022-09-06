import { getlogin } from './index'
import request from '@src/api/request.js'

//登录
export function loginAdmin(params) {
  //登录，参数为用户名和密码
  return getlogin('/loginadmin', params)
}

export function loginAPI(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}
