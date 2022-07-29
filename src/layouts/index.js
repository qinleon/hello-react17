import './index.css'
import { useEffect } from 'react'
import { message } from 'antd'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'

// 组件
import Header from '../components/header/header'
import Userlist from '../pages/Userlist/userlist'
import Commuinfo from '../pages/commuinfo/commuinfo'
import Userstati from '../pages/userstati/userstati'
import Merchanlist from '../pages/merchanlist/merchanlist'
import Loginaccou from '../pages/loginaccou/loginaccou'
import Merchans from '../pages/merchans/merchans'
// 权限管理
import ProductManage from '../pages/AuthManage/ProductManage/ProductManage.js'
// 角色管理
import RoleManage from '../pages/AuthManage/RoleManage/RoleManage'
// 404
import Notfound from '../pages/notfound/notfound'

function Layouts(props) {
  //记录当前用户第一个全线路有path
  // var redminPath;

  useEffect(() => {
    isLogin()
  }, [])

  //验证是否登录，若未登录跳回登录页
  function isLogin() {
    let username = localStorage.getItem('username')
    console.log(username)
    if (!username) {
      //若未登录，跳到登录页
      message.info('请先登录吧！')
      props.history.push('/login')
    }
  }

  return (
    <div className="admin_box">
      <div className="admin_top_box">
        <Header></Header>
      </div>
      <div className="admin_bottom_box">
        <div className="admin_right">
          {/*  Switch排他性匹配 */}
          <Switch>
            {/* exact严格模式 ,Redirect重定向*/}
            <Redirect exact={true} from="/layouts" to={'/'}></Redirect>
            <Route path="/layouts/userlist" component={Userlist}></Route>
            <Route path="/layouts/commuinfo" component={Commuinfo}></Route>
            <Route path="/layouts/userstati" component={Userstati}></Route>
            <Route path="/layouts/merchanlist" component={Merchanlist}></Route>
            <Route path="/layouts/loginaccou" component={Loginaccou}></Route>
            <Route path="/layouts/merchas" component={Merchans}></Route>
            <Route path="/layouts/authManage/productManage" component={ProductManage}></Route>
            <Route path="/layouts/authManage/roleManage" component={RoleManage}></Route>

            {/* 一定能匹配到 */}
            <Route component={Notfound}></Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

//高阶组件，获取路由上下文
export default withRouter(Layouts)
