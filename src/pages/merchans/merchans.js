import React from 'react'
import { Button } from 'antd'
import { Redirect, Route } from 'react-router-dom'
import Merchanstati from '../../components/merchanstati/merchanstati'
import Merchanlogin from '../../components/merchanlogin/merchanlogin'

import style from './merchans.module.css'

export default class Merchans extends React.Component {
  //跳商户品类分析
  tomerchansta = () => {
    this.props.history.push('/layouts/merchas/merchanstati')
  }

  //跳商户登录分析
  tomerlogin = () => {
    this.props.history.push('/layouts/merchas/merchanlogin')
  }

  render() {
    return (
      <div className={style.merchans}>
        <div className={style.merchaleft}>
          <Button onClick={this.tomerchansta} className={style.merchanbut} type="primary">
            分析商户品类
          </Button>
          <Button onClick={this.tomerlogin} className={style.merchlogbut} type="primary">
            分析商户登录
          </Button>
        </div>
        <div className={style.merchanright}>
          <Redirect exact={true} from="/layouts/merchas" to="/layouts/merchas/merchanstati"></Redirect>
          <Route path="/layouts/merchas/merchanstati" component={Merchanstati}></Route>
          <Route path="/layouts/merchas/merchanlogin" component={Merchanlogin}></Route>
        </div>
      </div>
    )
  }
}
