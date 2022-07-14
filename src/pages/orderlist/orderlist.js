import { Route,Redirect } from 'react-router-dom'
import Orders from '../../components/orders/orders'
import store from '../../store'
import {Input} from 'antd';
import Orderadd from '../../components/orderadd/orderadd'
import style from './orderlist.module.css'
import {All} from '../../store/actions'
import { useState } from 'react'




export default function Orderlist(props){

    // //原数据
    // let [listdata,setlistdata] = useState(store.getState().data)

    //查询条件初始状态
    let [seardata,setsear] = useState({
        id:""
    })

    // //改变了state，响应式渲染页面
    // store.subscribe(()=>{
    //     setlistdata(store.getState().alldata)
    // })

    //查询条件双向绑定
    function changeval(e){
        setsear({
            ...seardata,
            [e.target.name]:e.target.value
        })
    }

    //查询
    function searchData(){
        store.dispatch(All(seardata))
    }

    function toAdd(){
        props.history.push('/layouts/orderlist/orderadd')
    }

    return (
        <div className={style.orderlist}>
            <div className={style.ordertop}>
                <h3>订单列表</h3>
                <Input value={seardata.id} onChange={changeval} size="large" name="id" allowClear="true" style={{width:"300px",marginLeft:"20px"}} placeholder="请输入ID" />
                <button className="sear" onClick={()=>searchData()}>搜索</button>
                <button onClick={()=>toAdd()}>增加</button>   
            </div>
            <div className={style.ordercont}>
                <Redirect exact={true} from="/layouts/orderlist" to="/layouts/orderlist/orders"></Redirect>
                <Route path="/layouts/orderlist/orders" component={Orders}></Route>
                <Route path="/layouts/orderlist/orderadd" component={Orderadd}></Route>
            </div>
        </div>
    )
}