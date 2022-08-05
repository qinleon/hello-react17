import request from '@src/api/request.js'

// 获取列表数据接口
export function getDictionaryList(params) {
  return request({
    url: '/v1/gk/dict/page',
    method: 'post',
    data: params,
  })
}

// 保存接口
export function saveDictionary(params) {
  return request({
    url: '/v1/gk/dict/save',
    method: 'post',
    data: params,
  })
}

// 删除接口
export function delDictionary(params) {
  return request({
    url: '/v1/gk/dict/delete',
    method: 'post',
    data: params,
  })
}
// 根据产品获取数据类型列表
export function getDataTypeListByProductAPI(productCode) {
  return request.post('/v1/gk/p-t-e/show', { productCode })
}

// 字典子项绑定角色权限
// {
// 	"dictId": 0,
// 	"dictName": "",
// 	"dictType": "",
// 	"subDictBindRoleList": [
// 		{
// 			"dictId": 0,
// 			"roleIds": [],
// 			"subDictId": "",
// 			"subDictName": "",
// 		}
// 	]
// }
export function subDictBindRolesAPI(param) {
  return request.post('/v1/gk/dict/subDictBindRoles', param)
}
// 根据一级字典获取子项及绑定角色
export function getSubDictListByDictAPI(dictId) {
  return request.post('/v1/gk/dict/getSubDictListByDict', { dictId })
}
// 删除字典子项
export function deleteSubDictAPI(dictId, subDictId) {
  return request.post('/v1/gk/dict/deleteSubDict', {
    dictId,
    subDictId,
  })
}
