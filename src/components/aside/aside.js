import React from 'react'
import { Menu } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import allowRoutes from '../../grants'
import './aside.css'

class Aside extends React.Component {
  constructor(props) {
    super()
    this.state = {
      userpaths: [],
      menus: [
        {
          label: '处置管理',
          key: 'sub1',
          icon: <MailOutlined />,
          children: [{ label: '新建任务', key: '/layouts/gkList' }],
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
        {
          label: '系统管理',
          key: 'sub4',
          children: [{ label: '任务配置', key: '/layouts/systemManage/userDictionary' }],
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
    this.props.history.push(e.key, { info: '2323' })
  }

  render() {
    return <Menu mode="horizontal" theme="light" className="flex-1" items={this.state.menus} onClick={this.onClick} />
  }
}
export default withRouter(Aside)
