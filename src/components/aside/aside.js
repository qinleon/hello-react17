import React from 'react'
import { Menu } from 'antd'
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons'
import { NavLink, withRouter } from 'react-router-dom'
import allowRoutes from '../../grants'
import './aside.css'

const { SubMenu } = Menu

class Aside extends React.Component {
  constructor(props) {
    super()
    this.state = {
      userpaths: [],
      menus: [
        {
          label: '用户管理',
          key: 'sub1',
          icon: <MailOutlined />,
          children: [
            { label: '用户列表', key: '/layouts/userlist' },
            { label: '通讯信息', key: '/layouts/commuinfo' },
          ],
        },
        {
          label: '商户管理',
          key: 'sub2',
          icon: <MailOutlined />,
          children: [
            { label: '商户列表', key: '/layouts/merchanlist' },
            { label: '登录账户', key: '/layouts/loginaccou' },
            { label: '商户分析', key: '/layouts/merchas' },
          ],
        },
        {
          label: '权限管理',
          key: 'sub3',
          children: [
            { label: '产品管理', key: '/layouts/authManage/productManage' },
            { label: '角色管理', key: '/layouts/authManage/roleManage' },
          ],
        },
      ],
    }
  }

  //获取筛选过后新的用户权限路由配置
  componentDidMount() {
    this.setState({
      userpaths: allowRoutes,
    })
  }

  isshowmeau(meaupath) {
    let res = allowRoutes.some(item => item.path === meaupath)
    return res
  }
  onClick = e => {
    this.props.history.push(e.key)
  }

  render() {
    return <Menu mode="horizontal" theme="light" className="flex-1" items={this.state.menus} onClick={this.onClick} />
  }
}
export default withRouter(Aside)
