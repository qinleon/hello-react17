import Layouts from './layouts'
import React from 'react'
import 'antd/dist/antd.css'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import store from './store/store'
import { Spin } from 'antd'
import './App.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { getDataTypeList, getDictList } from '@src/store/actions'
const UserNameContext = React.createContext()
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isshowAdduser: false,
      isload: store.getState().isload,
    }
  }
  componentDidMount() {
    this.props.getDataTypeList()
    this.props.getDictList()
  }

  fn = str => {
    console.log('传来的str:', str)
    this.setState({
      isshowAdduser: str,
    })
  }

  render = () => (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <BrowserRouter>
          <Spin size="large" className="loading" spinning={false} />
          <Switch>
            <Route path="/" component={Layouts}></Route>
          </Switch>
        </BrowserRouter>
        <UserNameContext.Provider value={1}></UserNameContext.Provider>
      </div>
    </ConfigProvider>
  )
}

//将state中指定的的数据（状态）映射到当前组件的props上
// const mapStateToProps =(state)=>{
//   return {
//       isload:state.isload
//   }
// }

// //把dispatch和props联系起来
const mapStateToProps = state => {
  return {
    count: state.count,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getDataTypeList() {
      dispatch(getDataTypeList())
    },
    getDictList() {
      dispatch(getDictList())
    },
  }
}
//connect()连接redux和react组件
export default connect(mapStateToProps, mapDispatchToProps)(App)
