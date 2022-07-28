/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-06-01 19:11:00
 * @LastEditors: Qleo
 * @LastEditTime: 2022-07-26 14:24:15
 */

import http from '@src/api/request.js'
export function getProductListAPI() {
  return http.post('/v1/exec/pt/list', {})
}
export function getProductGroupListAPI(param) {
  return http.post('/v1/exec/g-o-p/page', param)
}
// 获取列表数据接口
export function getExecptList(params = {}) {
  return http({
    url: '/v1/exec/pt/list',
    method: 'post',
    data: params,
  })
}
// 新增产品分类管理
export function getExecGopSave(params) {
  return http({
    url: '/v1/exec/g-o-p/save',
    method: 'post',
    data: params,
  })
}
// 产品分类管理
export function getExecGopPage(params) {
  return http({
    url: '/v1/exec/g-o-p/page',
    method: 'post',
    data: params,
  })
}
// 保存分组和产品信息
export function saveGroupProductInfoAPI(params) {
  return http({
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
  return http.post('/v1/exec/g-o-p/remove', { deleteIds })
}

/**
 * @name: 删除分组前检查有没有占用
 * @param {string[]} deleteIds
 */
export function beforeCheckDeleteProductGroupAPI(deleteIds) {
  return http.post('/v1/exec/g-o-p/check', { deleteIds })
}

/**
 * @name: 获取当前角色有权限的产品列表
 * @return {*}  null
 */
export function getProductListByRoleAPI() {
  return http.post('/v1/exec/r-m-code-group-mapping/getProductListByRole')
}
