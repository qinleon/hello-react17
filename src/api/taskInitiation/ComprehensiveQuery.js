import request from '@/api/request'
// 高级搜索列表
export function postSeniorSearchList(params) {
  return request({
    url: '/v1/exec/h-s-c/list',
    method: 'post',
    data: params,
  })
}
// 保存按钮
export function postSeniorSearchSave(params) {
  return request({
    url: '/v1/exec/h-s-i/save',
    method: 'post',
    data: params,
  })
}
// 删除按钮
export function postDeleteSearch(params) {
  return request({
    url: '/v1/exec/h-s-i/remove',
    method: 'post',
    data: params,
  })
}
// 查询最近保存数据
export function postCurrentData(params) {
  return request({
    url: '/v1/exec/h-s-i/list',
    method: 'post',
    data: params,
  })
}
// 查询最近保存数据
export function postAllData(params) {
  return request({
    url: '/v1/exec/h-s-i/list',
    method: 'post',
    data: params,
  })
}
// 搜索接口
export function searchData(params) {
  return request({
    url: '/v1/exec/h-s-r/search',
    method: 'post',
    data: params,
  })
}
// 平台数量接口
export function postDynamic(params) {
  return request({
    url: '/v1/exec/h-s-r/count',
    method: 'post',
    data: params,
  })
}
// 平台类型接口
export function postDynamicList(params) {
  return request({
    url: '/v1/exec/p-s-d-m/listByGroup',
    method: 'post',
    data: params,
  })
}
