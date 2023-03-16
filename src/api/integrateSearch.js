import request from './request'
import axios from 'axios'
// 搜索融合搜索列表
let cancel
export function getIntegrateSearchListAPI(params) {
  const CancelToken = axios.CancelToken
  if (cancel) {
    cancel()
  }
  return request.post('/gk/api/v1/protect/search/complex', params, {
    cancelToken: new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      cancel = c
    }),
  })
}
// 搜索融合搜索列表
export function getProductResultNumAPI(params) {
  // return request.post('/gk/api/v1/protect/search/dataChannel', params)
  return request.post('/gk/api/v1/protect/testSearch/getMediaNameForAggs', params)
}

// 获取字典信息
export function getDic(params) {
  return request({
    url: '/gk/api/v1/protect/dictionary/find',
    method: 'post',
    data: params,
  })
}

// 获取左侧常用搜索列表
export function getSearchRecord(params) {
  return request({
    url: '/gk/api/v1/protect/search_record/all',
    method: 'post',
    data: params,
  })
}

// 左侧新增常用搜索和分组
export function addSearchRecord(params) {
  return request({
    url: '/gk/api/v1/protect/search_record/add',
    method: 'post',
    data: params,
  })
}

// 左侧修改常用搜索和分组
export function upDataSearchRecord(params) {
  return request({
    url: '/gk/api/v1/protect/search_record/update',
    method: 'post',
    data: params,
  })
}

// 左侧删除常用搜索和分组
export function delSearchRecord(params) {
  return request({
    url: '/gk/api/v1/protect/search_record/delete',
    method: 'post',
    data: params,
  })
}

// 左侧常用搜索和分组修改顺序
export function changeOrder(params) {
  return request({
    url: '/gk/api/v1/protect/search_record/changeOrder',
    method: 'post',
    data: params,
  })
}

// 查询数据是否在待管控列表中
export function getIsdisposeList(params) {
  return request({
    url: '/detail-api/v1/common/judgeByEsId',
    method: 'post',
    data: params,
  })
}

// 导出
export function exportExcelAPI(params) {
  return request.post('/gk/api/v1/protect/export/excel', params)
}
/**
 * @name:查询导出记录
 */
export function getExportLogAPI(params) {
  return request({
    url: '/v1/exec/export/view', // 巩光志
    method: 'post',
    data: params,
  })
}
