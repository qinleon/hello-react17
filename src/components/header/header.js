import React from 'react'
import './header.css'
import { Link } from 'react-router-dom'
import Aside from '../aside/aside'

export default class Header extends React.Component {
  constructor(props) {
    super()
    this.state = {
      username: '',
    }
  }

  componentDidMount() {
    let username = localStorage.getItem('username')
    this.setState({
      username: username ? username : '当前未登录账户',
    })
  }

  //退出当前账户
  toLogin = () => {
    // localStorage.clear()
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  render() {
    return (
      <div className="header_nav flex-between">
        <Aside></Aside>
        <div className="welcoms">
          <div className="wel_top">
            <div className="ttp">
              欢迎您
              <select>
                <option>{this.state.username}</option>
              </select>
            </div>
            <div className="wel_bot">
              <p className="tp">
                <Link to="/login" onClick={this.toLogin}>
                  退出登录
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
