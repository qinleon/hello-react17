import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './assets/css/common.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { loginAPI } from '@src/api/login'
import { authenticateSuccess } from '@src/utils/Session.js'
import { param2Obj } from '@src/utils/myContext.js'
// 地址栏是否有code
function login(code) {
  return new Promise((resolve, reject) => {
    loginAPI({ code }).then(response => {
      authenticateSuccess(response.data)
      console.log('login-success')
      resolve()
    })
  })
}
;(async () => {
  const url = window.location.href
  const urlObj = param2Obj(url)
  const { code, external } = urlObj
  //  外部参数
  if (external) {
    localStorage.setItem('external', decodeURIComponent(external))
  }
  if (code) {
    await login(code)
  }
  ReactDOM.render(<App />, document.getElementById('root'))
})()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
