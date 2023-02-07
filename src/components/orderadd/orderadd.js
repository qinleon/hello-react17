import style from './orderadd.module.css'
import store from '../../store/store.js'
import { ADD } from '../../store/actions'
import { useState } from 'react'

export default function Orderadd(props) {
  //保存框数据双向绑定
  let [orderadd, setorderadd] = useState({
    id: '',
    ordercode: '',
    ordertime: '',
    ordermoney: '',
    goodsname: '',
    goodscount: '',
    ordertype: '',
    username: '',
    state: '',
  })

  //保存的双向绑定函数
  function changeVal(e) {
    setorderadd({
      ...orderadd,
      [e.target.name]: e.target.value,
    })
  }

  //保存框取消事件函数
  function exitAdd() {
    props.history.push('/layouts/orderlist/orders')
  }

  //确认添加函数
  function addorder() {
    store.dispatch(ADD(orderadd))
    setorderadd({
      id: '',
      ordercode: '',
      ordertime: '',
      ordermoney: '',
      goodsname: '',
      goodscount: '',
      ordertype: '',
      username: '',
      state: '',
    })
  }

  return (
    <div className={style.orderadd}>
      <table className={style.savet}>
        <tbody>
          <tr>
            <td>ID</td>
            <td>
              <input name="id" value={orderadd.id} onChange={e => changeVal(e)} type="text" placeholder="请输入ID" />
            </td>
          </tr>
          <tr>
            <td>订单编号</td>
            <td>
              <input
                name="ordercode"
                value={orderadd.ordercode}
                onChange={e => changeVal(e)}
                type="text"
                placeholder="请输入订单编号"
              />
            </td>
          </tr>
          <tr>
            <td>下单时间</td>
            <td>
              <input
                name="ordertime"
                value={orderadd.ordertime}
                onChange={e => changeVal(e)}
                type="datetime-local"
                placeholder="请输入下单时间"
              />
            </td>
          </tr>
          <tr>
            <td>订单金额(元)</td>
            <td>
              <input
                name="ordermoney"
                value={orderadd.ordermoney}
                onChange={e => changeVal(e)}
                type="text"
                placeholder="请输入订单金额(元)"
              />
            </td>
          </tr>
          <tr>
            <td>商品名称</td>
            <td>
              <input
                name="goodsname"
                value={orderadd.goodsname}
                onChange={e => changeVal(e)}
                type="text"
                placeholder="请输入商品名称"
              />
            </td>
          </tr>
          <tr>
            <td>数量</td>
            <td>
              <input
                name="goodscount"
                value={orderadd.goodscount}
                onChange={e => changeVal(e)}
                type="number"
                placeholder="请输入数量"
              />
            </td>
          </tr>
          <tr>
            <td>支付方式</td>
            <td>
              <input
                name="ordertype"
                value={orderadd.ordertype}
                onChange={e => changeVal(e)}
                type="text"
                placeholder="请输入支付方式"
              />
            </td>
          </tr>
          <tr>
            <td>用户名</td>
            <td>
              <input
                name="username"
                value={orderadd.username}
                onChange={e => changeVal(e)}
                type="text"
                placeholder="请输入用户名"
              />
            </td>
          </tr>
          <tr>
            <td>订单状态</td>
            <td>
              <input
                name="state"
                value={orderadd.state}
                onChange={e => changeVal(e)}
                type="text"
                placeholder="请输入订单状态"
              />
            </td>
          </tr>
          <tr>
            <td>
              <button value="返回" onClick={exitAdd}>
                返回
              </button>
            </td>
            <td>
              <button value="保存" onClick={addorder}>
                保存
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
