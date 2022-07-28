//该模块封装各种请求
import service from '../utils/service'

//post请求
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service
      .post(url, params)
      .then(
        res => {
          if (res.data) {
            resolve(res.data)
          } else {
            resolve(res)
          }
        },
        err => {
          reject(err)
        }
      )
      .catch(err => {
        reject(err)
      })
  })
}

//get请求
export function get(url, params) {
  //拼接请求参数,请求参数默认为对象
  let queryStr = ''
  let arr = []
  for (var key in params) {
    if (params[key]) {
      //如果有值
      arr.push(`${key}=${params[key]}`)
    }
  }
  queryStr = arr.join('&')

  return new Promise(function (resolve, reject) {
    service
      .get(url + '?' + queryStr)
      .then(
        res => {
          if (!res.data) {
            resolve(res)
          }
          resolve(res.data)
        },
        err => {
          reject(err)
        }
      )
      .catch(err => {
        reject(err)
      })
  })
}

//delete请求
export function remove(url, id) {
  return new Promise(function (resovle, reject) {
    service
      .delete(url + '/' + id)
      .then(
        res => {
          if (!res.data) {
            resovle(res)
          }
          resovle(res.data)
        },
        err => {
          reject(err)
        }
      )
      .catch(err => {
        reject(err)
      })
  })
}

//put请求
export function update(url, id, data) {
  return new Promise(function (resovle, reject) {
    service
      .put(url + '/' + id, data)
      .then(
        res => {
          if (!res.data) {
            resovle(res)
          }
          resovle(res.data)
        },
        err => {
          reject(err)
        }
      )
      .catch(err => {
        reject(err)
      })
  })
}

//登录(get)
export function getlogin(url, params) {
  let queryStr = queryStrFn(params)
  return new Promise(function (resolve, reject) {
    service.get(url + '?' + queryStr).then(res => {
      //查到数据
      // console.log('我是res.data',res.data);
      resolve({
        code: 1,
        token: ranToken(),
        paths: res.data[0].paths,
        curd: res.data[0].zsgc,
      })
    })
  })
}

//随机一个模拟token
function ranToken() {
  let str = 'ZXCVBNMASDFGHJKSRDTJFGLQWERTYUIOP'
  let str_len = str.length
  let token_str = ''

  //随机一个100位的字符串
  for (let i = 0; i < 100; i++) {
    let rannum = parseInt(Math.random() * str_len)
    token_str += str.charAt(rannum)
  }

  return token_str
}

//拼接请求参数
function queryStrFn(obj) {
  let arr = []
  for (var key in obj) {
    if (obj[key]) {
      //如果有值
      arr.push(`${key}=${obj[key]}`)
    } else {
      return 'username=12'
    }
  }
  return arr.join('&')
}
