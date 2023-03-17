import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './assets/css/common.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { loginAPI } from '@src/api/login'
import { authenticateSuccess } from '@src/utils/Session.js'
import { param2Obj } from '@src/utils/myContext.js'
import '@/icons' // icon
import { Provider, connect } from 'react-redux'
import store from './store/store.js'
import { getDataTypeList, getDictList } from '@src/store/actions'
import locale from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'

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
const mapStateToProps = state => {
  return {
    count: state.count,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getDataTypeList() {
      dispatch(getDataTypeList())
    },
    getDictList() {
      dispatch(getDictList())
    },
  }
}
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)
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
  ReactDOM.render(
    // 只要利用Provider将祖先组件包裹起来
    // 并且通过Provider的store属性将Redux的store传递给Provider
    // 那么就可以在所有后代中直接使用Redux了
    <Provider store={store}>
      <React.StrictMode>
        <ConfigProvider locale={locale}>
          <AppContainer />
        </ConfigProvider>
      </React.StrictMode>
    </Provider>,
    document.getElementById('root')
  )
})()
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
