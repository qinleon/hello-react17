import React from 'react'
import './header.css'
import {Link} from 'react-router-dom'

export default class Header extends React.Component{

    constructor(props){
        super()
        this.state = {
            username:""
        }
    }

    componentDidMount(){
        let username = localStorage.getItem('username')
        this.setState({
            username:username?username:"当前未登录账户"
        })
    }

    //退出当前账户
    toLogin=()=>{
        // localStorage.clear()
        localStorage.removeItem('token')
        localStorage.removeItem('username')
    }

    render(){
        return (
            <div className="header_nav">
                {/* <div className="imgg">
                    <img src='/img/logo.jpg' alt="logo"/>
                </div> */}
                <div className="h2">
                    点餐后台管理系统
                </div>
                <div className="meg">
                    消息<span>130</span>
                </div>
                <div className="welcoms">
                    <div className="wel_top" >
                        <div className="ttp">
                            欢迎您
                            <select>
                                    <option>{this.state.username}</option>
                            </select>
                        </div>    
                        <div className="wel_bot">
                            <p className="tp">
                                <a href="">
                                    我的账户
                                </a>
                                <span>丨</span>
                                <Link to="/login" onClick={this.toLogin}>
                                    退出登录
                                </Link>
                            </p>
                            <div>
                                <p>登录：100次</p>
                                <p>下单：100次</p>
                                <p>好评：100次</p>
                                <p>积分：1000分</p>
                                <p>安全级别：最高</p>
                            </div>
                        </div>         
                    </div>
                </div>
                    
            </div>
                
        )
    }
}
