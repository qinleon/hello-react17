import React from 'react'
import { Menu } from 'antd'
import { MailOutlined, AppstoreOutlined, LayoutOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import userpathsFn from '../../grants'

import './aside.css'

const { SubMenu } = Menu

export default class Aside extends React.Component {
  constructor(props) {
    super()
    this.state = {
      userpaths: []
    }
  }

  //获取筛选过后新的用户权限路由配置
  componentDidMount() {
    this.setState({
      userpaths: userpathsFn()
    })
  }

  isshowmeau(meaupath) {
    console.log('userpathsFn()', userpathsFn())
    let res = userpathsFn().some(item => item.path == meaupath)
    return res
  }

  render() {
    return (
      <>
        <Menu
          style={{ width: 161 }}
          defaultOpenKeys={['sub1']}
          // defaultSelectedKeys={['1']}
          mode="inline"
          theme="light"
        >
          <SubMenu key="sub1" icon={<MailOutlined />} title="用户管理">
            {/* {
                 this.state.userpaths.map((item,idx)=>(

                  <Menu.Item key={idx}>
                      <NavLink to={item.path} activeClassName="tochange">
                          {item.title}
                      </NavLink>
                  </Menu.Item>
                 ))
                  
              } */}
            <Menu.Item key="1" style={{ display: this.isshowmeau('/layouts/userlist') ? 'block' : 'none' }}>
              <NavLink to="/layouts/userlist" activeClassName="tochange">
                用户列表
              </NavLink>
            </Menu.Item>
            <Menu.Item key="2" style={{ display: this.isshowmeau('/layouts/commuinfo') ? 'block' : 'none' }}>
              <NavLink to="/layouts/commuinfo" activeClassName="tochange">
                通讯信息
              </NavLink>
            </Menu.Item>
            <Menu.Item key="3" style={{ display: this.isshowmeau('/layouts/userstati') ? 'block' : 'none' }}>
              <NavLink to="/layouts/userstati" activeClassName="tochange">
                统计分析
              </NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreOutlined />} title="商户管理">
            <Menu.Item key="4" style={{ display: this.isshowmeau('/layouts/merchanlist') ? 'block' : 'none' }}>
              <NavLink to="/layouts/merchanlist" activeClassName="tochange">
                商户列表
              </NavLink>
            </Menu.Item>
            <Menu.Item key="5" style={{ display: this.isshowmeau('/layouts/loginaccou') ? 'block' : 'none' }}>
              <NavLink to="/layouts/loginaccou" activeClassName="tochange">
                登录账户
              </NavLink>
            </Menu.Item>
            <Menu.Item key="8" style={{ display: this.isshowmeau('/layouts/merchas') ? 'block' : 'none' }}>
              <NavLink to="/layouts/merchas" activeClassName="tochange">
                商户分析
              </NavLink>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreOutlined />} title="权限管理">
            <Menu.Item key="9" style={{ display: this.isshowmeau('/layouts/merchanlist') ? 'block' : 'none' }}>
              <NavLink to="/layouts/merchanlist" activeClassName="tochange">
                商户列表
              </NavLink>
            </Menu.Item>
            <Menu.Item key="10" style={{ display: this.isshowmeau('/authManage/productManage') ? 'block' : 'none' }}>
              <NavLink to="/authManage/productManage" activeClassName="tochange">
                登录账户
              </NavLink>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </>
    )
  }
}
