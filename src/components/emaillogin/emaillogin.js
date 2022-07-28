import React from 'react'
import { loginAdmin } from '../../api/login'
import { message } from 'antd'
import style from './emaillogin.module.css'

export default class Emaillogin extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loginobj: {
        email: '',
        userpass: '',
      },
    }
  }

  //登录框双向绑定
  changeval = e => {
    this.setState({
      loginobj: {
        ...this.state.loginobj,
        [e.target.name]: e.target.value,
      },
    })
  }

  //登录
  async tologin() {
    let data = await loginAdmin(this.state.loginobj)
    if (data.length !== 0) {
      //查到数据,存储token
      message.info('登录成功')
      localStorage.setItem('token', data.token)
      localStorage.setItem('paths', JSON.stringify(data.paths))
      localStorage.setItem('curd', data.curd)
      localStorage.setItem('username', this.state.loginobj.email)
      this.props.history.push('/layouts')
    } else {
      //未查到数据
      message.info('登录失败')
    }
  }

  render() {
    return (
      <table className={style.emaillogin}>
        <tbody>
          <tr className={style.title}>
            <td colSpan="2">后台管理系统登录</td>
          </tr>
          <tr>
            <td>邮箱号:</td>
            <td>
              <input
                name="email"
                onChange={this.changeval}
                value={this.state.loginobj.email}
                type="email"
                placeholder="请输入邮箱号"
              />
            </td>
          </tr>
          <tr>
            <td>密码:</td>
            <td>
              <input
                name="userpass"
                onChange={this.changeval}
                value={this.state.loginobj.userpass}
                type="password"
                placeholder="请输入密码"
              />
            </td>
          </tr>
          <tr className={style.logined}>
            <td colSpan="2">
              <button onClick={() => this.tologin()}>登录</button>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}
