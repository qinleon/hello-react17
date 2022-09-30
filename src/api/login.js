import request from '@src/api/request.js'

export function loginAPI(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}
