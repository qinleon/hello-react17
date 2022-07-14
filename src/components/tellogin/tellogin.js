import React from 'react'
import { loginAdmin } from '../../api/login'
import { message } from 'antd'
import style from './tellogin.module.css'

export default class Tellogin extends React.Component {
  constructor(props) {
    super()
    this.state = {
      loginobj: {
        username: '',
        userpass: ''
      }
    }
  }

  //登录框双向绑定
  changeval = e => {
    this.setState({
      loginobj: {
        ...this.state.loginobj,
        [e.target.name]: e.target.value
      }
    })
  }

  //登录
  async tologin() {
    //查到数据,存储token
    message.info('登录成功')
    localStorage.setItem('token', '1212')
    localStorage.setItem('username', this.state.loginobj.username)
    this.props.history.push('/layouts')
  }

  render() {
    return (
      <table className={style.tellogin}>
        <tbody>
          <tr className={style.title}>
            <td colSpan='2'>点餐后台管理系统登录</td>
          </tr>
          <tr>
            <td>手机号:</td>
            <td>
              <input
                name='username'
                onChange={this.changeval}
                value={this.state.loginobj.username}
                type='tel'
                placeholder='请输入手机号'
              />
            </td>
          </tr>
          <tr>
            <td>密码:</td>
            <td>
              <input
                name='userpass'
                onChange={this.changeval}
                value={this.state.loginobj.userpass}
                type='password'
                placeholder='请输入密码'
              />
            </td>
          </tr>
          <tr className={style.logined}>
            <td colSpan='2'>
              <button onClick={() => this.tologin()}>登录</button>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}
