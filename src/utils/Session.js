/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-07-14 15:24:50
 * @LastEditors: Qleo
 * @LastEditTime: 2022-07-14 15:24:51
 */
const LOGIN_COOKIE_NAME = 'vue_admin_template_token'

export function isAuthenticated() {
  return _getCookie(LOGIN_COOKIE_NAME)
}

export function authenticateSuccess(token) {
  _setCookie(LOGIN_COOKIE_NAME, token)
}

export function logout() {
  _setCookie(LOGIN_COOKIE_NAME, '', 0)
}

function _getCookie(name) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

function _setCookie(name, value, expire) {
  let date = new Date()
  date.setDate(date.getDate() + expire)
  document.cookie = name + '=' + escape(value) + '; path=/' + (expire ? ';expires=' + date.toGMTString() : '')
}
