import './index.css'
import { Switch, withRouter } from 'react-router-dom'
import FrontendAuth from '@src/router/FrontendAuth'
import routers from '@src/router/routers'
// 组件
import Header from '../components/header/header'

function Layouts(props) {
  return (
    <div className="admin_box">
      <div className="admin_top_box">
        <Header></Header>
      </div>
      <div className="admin_bottom_box">
        <div className="admin_right">
          <Switch>
            <FrontendAuth routerConfig={routers} />
          </Switch>
        </div>
      </div>
    </div>
  )
}

//高阶组件，获取路由上下文
export default withRouter(Layouts)
