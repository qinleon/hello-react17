import React, { Component, Suspense } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { casAuth } from '@src/utils/myContext.js'
import { isAuthenticated } from '@src/utils/Session.js'

class FrontendAuth extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props)
  }

  render() {
    const { routerConfig, location } = this.props
    const { pathname } = location
    // 如果该路由不用进行权限校验，登录状态下登陆页除外
    // 因为登陆后，无法跳转到登陆页
    // 这部分代码，是为了在非登陆状态下，访问不需要权限校验的路由
    const targetRouterConfig = routerConfig.find(item => item.path === pathname)
    // if (targetRouterConfig && !targetRouterConfig.auth && !hasToken) {
    //   const { component } = targetRouterConfig
    //   return <Route exact path={pathname} component={component} />
    // }
    const hasToken = isAuthenticated()
    if (hasToken) {
      // 如果是登陆状态，想要跳转到登陆，重定向到主页
      if (pathname === '/login') {
        return <Redirect to="/" />
      } else {
        // 如果路由合法，就跳转到相应的路由
        if (targetRouterConfig) {
          return (
            <Suspense fallback={<h1>12</h1>}>
              <Route path={pathname} component={targetRouterConfig.component} />
            </Suspense>
          )
        } else {
          // 如果路由不合法，重定向到 404 页面
          return <Redirect to="/404" />
        }
      }
    } else {
      casAuth(window.location.href)
      return false
    }
  }
}

export default withRouter(FrontendAuth)
