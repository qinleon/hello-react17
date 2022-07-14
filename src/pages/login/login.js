import React from 'react'
import { Redirect,Switch,Route } from 'react-router-dom'
import Tellogin from '../../components/tellogin/tellogin'
import Emaillogin from '../../components/emaillogin/emaillogin'
import style from './login.module.css'


export default class Login extends React.Component{

    constructor(props){
        super()
    }

    
    emaillogin=()=>{
        this.props.history.push('/login/emaillogin')
    }

    tellogin=()=>{
        this.props.history.push('/login/tellogin')
    }

    render(){
        return (
            <div className={style.login}>
                <div className={style.logincont}>
                    <div className={style.loginhead}>
                        <div onClick={this.tellogin}>
                            手机号登录
                        </div>
                        <div onClick={this.emaillogin}>
                            邮箱登录
                        </div>
                    </div>
                    <div className={style.logincontt}>
                        <Switch>
                            <Redirect exact={true} from="/login" to="/login/tellogin"></Redirect>
                            <Route path="/login/tellogin" component={Tellogin}></Route>
                            <Route path="/login/emaillogin" component={Emaillogin}></Route>
                        </Switch>
                    </div>
                    
                </div>
            </div>
        )
    }
}