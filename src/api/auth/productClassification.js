import request from '@src/api/request.js'
// 获取列表数据接口
export function getExecptList(params = {}) {
  return request({
    url: '/v1/exec/pt/list',
    method: 'post',
    data: params,
  })
}
// 新增产品分类管理
export function getExecGopSave(params) {
  return request({
    url: '/v1/exec/g-o-p/save',
    method: 'post',
    data: params,
  })
}
// 产品分类管理
export function getExecGopPage(params) {
  return request({
    url: '/v1/exec/g-o-p/page',
    method: 'post',
    data: params,
  })
}
// 保存分组和产品信息
export function saveGroupProductInfo(params) {
  return request({
    url: '/v1/exec/g-o-p/saveGroupProductInfo',
    method: 'post',
    data: params,
  })
}

/**
 * @name: 删除分组
 * @param {string[]} deleteIds
 */
export function deleteProductGroupAPI(deleteIds) {
  return request.post('/v1/exec/g-o-p/remove', { deleteIds })
}

/**
 * @name: 删除分组前检查有没有占用
 * @param {string[]} deleteIds
 */
export function beforeCheckDeleteProductGroupAPI(deleteIds) {
  return request.post('/v1/exec/g-o-p/check', { deleteIds })
}

/**
 * @name: 获取当前角色有权限的产品列表
 * @return {*}  null
 */
export function getProductListByRoleAPI() {
  return request.post('/v1/exec/r-m-code-group-mapping/getProductListByRole')
}
