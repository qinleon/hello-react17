/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-07-26 17:20:11
 * @LastEditors: Qleo
 * @LastEditTime: 2022-07-26 17:43:56
 */
/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-04-25 10:48:58
 * @LastEditors: Qleo
 * @LastEditTime: 2022-04-25 18:22:05
 */
import request from '@src/api/request.js'
/**
 * @name: 获取角色列表
 * @param {number} number 当前页，从0开始
 * @param {number} size
 * @param {string} keyword
 */
export function getRoleListAPI(params) {
  return request.post('/v1/exec/roles/page', params)
}
// 设置角色使能
export function updateRoleStatusAPI(params) {
  return request.post('/v1/exec/roles/updateStatus', params)
}
// 获取角色关联的用户列表
export function getUserListByRoleAPI(params) {
  return request.post('/v1/exec/roles/currentRoleUserInfo', params)
}
// 获取管控对象及子类列表
export function getMcObjectListAPI(params) {
  return request.post('/v1/exec/r-m-code-group-mapping/mcObjectList', params)
}
// 获取角色列表
export function getMcObjectListByRoleIdAPI(params) {
  return request.post('/v1/exec/r-m-code-group-mapping/list', params)
}
// 设置角色权限
export function saveRoleAuthAPI(params) {
  return request.post('/v1/exec/r-m-code-group-mapping/save', params)
}
