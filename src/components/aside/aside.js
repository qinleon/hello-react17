import React from 'react'
import { Menu } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import './aside.css'

class Aside extends React.Component {
  constructor(props) {
    super()
    this.state = {
      menus: [
        {
          label: '处置管理',
          key: 'sub1',
          icon: <MailOutlined />,
          children: [{ label: '新建任务', key: '/layouts/gkList' }],
        },
        {
          label: '搜索结果',
          key: '/layouts/search',
          icon: <MailOutlined />,
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
        {
          label: 'Demo',
          key: 'sub5',
          children: [{ label: '演示', key: '/layouts/Demo' }],
        },
      ],
    }
  }

  //获取筛选过后新的用户权限路由配置
  componentDidMount() {}

  onClick = e => {
    this.props.history.push(e.key, { info: '2323' })
  }
  render() {
    return <Menu mode="horizontal" theme="light" className="flex-1" items={this.state.menus} onClick={this.onClick} />
  }
}
export default withRouter(Aside)
