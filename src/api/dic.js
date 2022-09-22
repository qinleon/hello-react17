import request from '@/api/request'

// 获取管控对象类型
export function gktype(params) {
  return request({
    url: '/v1/gk/dl/mc-hc-list',
    method: 'post',
    data: params,
  })
}

// 获取所有枚举字典
export function enumAll(params = {}) {
  return request({
    url: '/v1/gk/s-e/findAll',
    method: 'post',
    data: params,
  })
}

// 选择产品
export function product(params) {
  return request({
    url: '/v1/gk/dl/mc-pt-list',
    method: 'post',
    data: params,
  })
}

/**
 * @name:获取字典列表
 * @param {string[]} dictType 字典类型 ['special', 'taskType', 'eventType', 'sourceType', 'level']
 */
export function dicList(param) {
  return request.post('v1/gk/dict/list', param)
}
// 获取数据类型列表
export function getDataTypeListAPI() {
  return request.post('/v1/exec/tk/dataType-list')
}
// 根据产品获取数据类型列表
export function getDataTypeListByProductAPI(productCode) {
  return request.post('/v1/gk/p-t-e/show', { productCode })
}
