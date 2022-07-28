import Layouts from './layouts'
import React from 'react'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './pages/login/login'
import store from './store'
import { Spin } from 'antd'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isshowAdduser: false,
      isload: store.getState().isload,
    }
  }

  fn = str => {
    console.log('传来的str:', str)
    this.setState({
      isshowAdduser: str,
    })
  }

  render = () => (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <Spin size="large" className="loading" spinning={false} />
          <Switch>
            <Redirect exact={true} from="/" to="/login"></Redirect>
            <Route path="/layouts" component={Layouts}></Route>
            <Route path="/login" component={Login}></Route>
          </Switch>
        </Provider>
      </BrowserRouter>
    </div>
  )
}

//将state中指定的的数据（状态）映射到当前组件的props上
// const mapStateToProps =(state)=>{
//   return {
//       isload:state.isload
//   }
// }

// //把dispatch和props联系起来
// const mapDispatchToProps = (dispatch)=>{
//   return {

//   }
// }

//connect()连接redux和react组件
// export default connect(mapStateToProps,mapDispatchToProps)(App)
export default App
