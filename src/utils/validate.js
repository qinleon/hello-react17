/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 公用的字符串校验长度
export function strLenValid(max = 256, errorTip) {
  return (rule, value, callback) => {
    const temp = value ? value.trim() : null
    if (temp) {
      if (temp.length > max) {
        const errorStr = errorTip || `请输入不超过${max}个字符`
        callback(new Error(errorStr))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}

// 验证前后空格
export function validSpace(errorTip) {
  return (rule, value, callback) => {
    if (value && value.length > 0) {
      if (value && value.trim()) {
        callback()
      } else {
        const errorStr = errorTip || `输入内容不能为空!`
        callback(new Error(errorStr))
      }
    } else {
      callback()
    }
  }
}
