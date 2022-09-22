import request from '@/api/request'
// 填写任务信息
export function getTcList(params) {
  return request({
    url: '/v1/exec/t-c/list',
    method: 'get',
    params,
  })
}
// 下发任务之前检查灰名单
export function checkBeforeDisposeAPI(param) {
  return request.post('/v1/exec/tk/check', param)
}
// 下发任务
export function postTkDispose(params) {
  // 账号类型等于账号，并且是直接下发
  if (params.mcObject === 10001 && params.flag === 1) {
    return new Promise((resolve, reject) => {
      request
        .post('/v1/exec/tk/check', params)
        .then(({ data }) => {
          resolve(request.post('/v1/exec/tk/dispose', params))
        })
        .catch(err => {
          reject(err)
        })
    })
  } else {
    return request.post('/v1/exec/tk/dispose', params)
  }
}
// 子任务列表
export function postTcPage(params) {
  return request({
    url: '/v1/exec/t-c/page',
    method: 'post',
    data: params,
  })
}
// 公司
export function postCompany(params) {
  return request({
    url: '/v1/gk/cy/list',
    method: 'post',
    data: {
      number: 0, // 页码
      size: 9999, // 每页条数
      ...params,
    },
  })
}
// 产品名称
export function postProduct(params) {
  return request({
    url: '/v1/gk/dl/mc-pt-list',
    method: 'post',
    data: {
      number: 0, // 页码
      size: 9999, // 每页条数
      ...params,
    },
  })
}
// 数据类型
export function postData(params) {
  return request({
    url: '/v1/gk/dl/mc-dt-list',
    method: 'post',
    data: params,
  })
}
// 操作类型
export function postOperation(params) {
  return request({
    url: '/v1/gk/dl/dh-list',
    method: 'post',
    data: {
      ...params,
    },
  })
}
// 导入
export function postDhList(params) {
  return request({
    url: '/v1/exec/tk/importExcel',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  })
}
export function postImportUrlExcel(params) {
  return request({
    url: '/v1/exec/tk/importUrlExcel',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  })
}
// 提取url
export function postMatch(params) {
  return request({
    url: '/v1/exec/tk/match',
    method: 'post',
    data: params,
  })
}
/**
 * @name: 批量提取url
 * @param {string[]} urlList url集合
 */
export function extractUrlsAPI(urlList) {
  return request.post('/v1/exec/prepared/prepared-match', { urlList })
}

/**
 * @name: 保存提取后的结果到待办列表
 * {
	"subtaskPreparedList": [
		{
			"datatypeCode": "ACCOUNT",
			"datatypeIndex": 10,
			"datatypeName": "账号",
			"enterpriseCode": "a45ff68e946d6336",
			"productCode": "5576b6ffca9b7dcb",
			"productName": "知乎",
			"sourceSystem": "导入",
			"uid": "223123",
			"url": "https://www.zhihu.com/people/223123"
		}
	]
}
 */
export function savePreparedAPI(params) {
  return request.post('/v1/exec/prepared/save', params)
}
export function postTcList(params) {
  return request({
    url: '/v1/exec/t-c/list',
    method: 'post',
    data: params,
  })
}

export function remoteSeach(params) {
  return request({
    url: '/v1/exec/h-s-r/search',
    method: 'post',
    data: params,
  })
}

export function getSearchCount(params) {
  return request({
    url: '/v1/exec/h-s-r/count',
    method: 'post',
    data: params,
  })
}

// /v1/exec/r-m-code-group-mapping/mcObjectListByRoleId
export function getObjectTypeList(params) {
  return request({
    url: '/v1/exec/r-m-code-group-mapping/mcObjectListByRoleId',
    method: 'post',
    data: params,
  })
}

// 获取待管控列表
export function getPreparedListAPI(params) {
  return request.post('/v1/exec/prepared/page', params)
}
// 获取待管控列表
export function getPreparedMarkListAPI(params) {
  return request.post('/v1/exec/prepared/mark', params)
}
/**
 * @name: 删除待管控列表
 * @param {string[]} ids 要删除的ids
 */
export function delPreparedListAPI(ids) {
  return request.post('/v1/exec/prepared/remove', { ids })
}

// 获取任务id
export function getTaskCodeAPI() {
  return request.post('/v1/exec/tk/task-serial')
}

// 下发待管控列表
export function disposeAPI(params) {
  return request.post('/v1/exec/prepared/dispose', params)
}

// 根据管控操作编码，检验待管控数据的操作编码是否一致
export function handlecodeAPI(params) {
  return request.post('/v1/exec/prepared/verify/handlecode', params)
}
