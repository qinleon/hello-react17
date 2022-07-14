import style from './orders.module.css'
import React from 'react'
import { Table, Button ,Modal} from 'antd';
import Draggable from 'react-draggable';
import store from '../../store'
import {All,DEl,UPD} from '../../store/actions'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {useState,useEffect} from 'react'


export default function Orders(props){

    let columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '订单编号',
            dataIndex: 'ordercode',
        },
        {
            title: '下单时间',
            dataIndex: 'ordertime',
        },
        {
            title: '订单金额(元)',
            dataIndex: 'ordermoney',
        },
        {
            title: '商品名称',
            dataIndex: 'goodsname',
        },
        {
            title: '数量',
            dataIndex: 'goodscount',
        },
        {
            title: '支付方式',
            dataIndex: 'ordertype',
        },    
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '订单状态',
            dataIndex: 'state',
        },  
        {
          title: '操作',
          key: 'action',
          render: (text, record,index) => (
              <><Button type="primary" onClick={()=>updateData(record)} >修改</Button>
                <Button type="primary"onClick={()=>showConfirm(record)} >删除</Button>
              </>
          ),
        },
      ]    
    
    //原数据
    let [listdata,setlistdata] = useState(store.getState().data)

    //改变了state，还需要订阅，使得响应式渲染页面
    store.subscribe(()=>{
        setlistdata(store.getState().alldata)
    })

    //首次加载执行
    useEffect(()=>{
        //首次渲染完毕即执行，[]为不依赖任何参数
        getAllData()
    },[])

    var draggleRef = React.createRef();

    //显示修改框部分初始数据
    let [showK,changeK] = useState({
        visible:false,
        disabled:true,
        bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    })

    //记录当前修改数据的id
    let [index,setindex] = useState(0)

    //解构
    let {visible,disabled,bounds} = showK

    //修改框数据双向绑定
    let [orderset,setorder] = useState(
        {
            "id": "",
            "ordercode": "",
            "ordertime": "",
            "ordermoney": "",
            "goodsname": "",
            "goodscount": "",
            "ordertype": "",
            "username": "",
            "state": ""
        })

    //修改双向绑定函数
    function changeVal(e){
        setorder({
            ...orderset,
            [e.target.name]:e.target.value
        })
    }
    
    //修改框部分
    function showModal(){
        changeK({
            ...showK,
            visible: true
        })
      };
    
    //关闭修改框
    function handleCancel(e){
        changeK({
            ...showK,
            visible: false
        })
      };

    function onStart(event, uiData){
        const { clientWidth, clientHeight } = window?.document?.documentElement;
        const targetRect = draggleRef?.current?.getBoundingClientRect();
        changeK({
            ...showK,
            bounds: {
                left: -targetRect?.left + uiData?.x,
                right: clientWidth - (targetRect?.right - uiData?.x),
                top: -targetRect?.top + uiData?.y,
                bottom: clientHeight - (targetRect?.bottom - uiData?.y),
                },
        })
    };

    //获取所有数据
    function getAllData(){
        //派发action,获取所有数据
        store.dispatch(All())    
    }

    //删除数据
    function removeData(id){
        store.dispatch(DEl(id))
    }

    //显示修改框
    function updateData(record){
        showModal()
        setorder(record)
        setindex(record.id)
    }

    //修改数据
    function updataorder(){
        store.dispatch(UPD({
            id:index,
            data:orderset
        }))
        handleCancel()
        setorder(
            {
                "id": "",
                "ordercode": "",
                "ordertime": "",
                "ordermoney": "",
                "goodsname": "",
                "goodscount": "",
                "ordertype": "",
                "username": "",
                "state": ""
            })
    }

    function destroyAll(){
        Modal.destroyAll();
    }

    //显示删除确认框
    function showConfirm(record){
        const { confirm } = Modal; 
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: <p>确定删除吗？</p>,
              onOk(){
                removeData(record.id)
              },
              onCancel(){
                destroyAll()
              } 
        })
    }
    
    return (
        <div className={style.orders}>
            <Table style={{marginTop:"15px"}} columns={columns} dataSource={listdata}></Table>                
            
            {/* 修改 */}
            <>
             
             <Modal
             title={
                 <div
                 style={{
                     width: '100%',
                     cursor: 'move',
                 }}
                 onMouseOver={() => {
                     if (disabled) {
                        changeK({
                            ...showK,
                            disabled: false
                        })
                     }
                     console.log('改变后disabled',disabled);
                 }}
                 onMouseOut={() => {
                    changeK({
                        ...showK,
                        disabled: false
                    })
                 }}
                 // fix eslintjsx-a11y/mouse-events-have-key-events
                 // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                 onFocus={() => {}}
                 onBlur={() => {}}
                 // end
                 >
                 请修改订单列表！
                 </div>
             }
                 visible={visible}
                 okText={'修改'}
                 width="550px"
                 bodyStyle={{height:"350px"}}
                 cancelText={'取消'}
                 onOk={()=>updataorder()}
                 onCancel={()=>handleCancel()}
                 modalRender={modal => (
                 <Draggable
                 disabled={disabled}
                 bounds={bounds}
                 onStart={(event, uiData) => onStart(event, uiData)}
                 >
                 <div ref={draggleRef}>{modal}</div>
                 </Draggable>
             )}
             >
             
                {/* 修改 */}
                <table className={style.set_table}>
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td><input name="id" value={orderset.id} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入ID"/></td>
                        </tr>
                        <tr>
                            <td>订单编号</td>
                            <td><input name="ordercode" value={orderset.ordercode} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入订单编号"/></td>
                        </tr>
                        <tr>
                            <td>下单时间</td>
                            <td><input name="ordertime" value={orderset.ordertime} onChange={(e)=>changeVal(e)} type="datetime-local" placeholder="请输入下单时间"/></td>
                        </tr>   
                        <tr>
                            <td>订单金额(元)</td>
                            <td><input name="ordermoney" value={orderset.ordermoney} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入订单金额(元)"/></td>
                        </tr>
                        <tr>
                            <td>商品名称</td>
                            <td><input name="goodsname" value={orderset.goodsname} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入商品名称"/></td>
                        </tr>
                        <tr>
                            <td>数量</td>
                            <td><input name="goodscount" value={orderset.goodscount} onChange={(e)=>changeVal(e)} type="number" placeholder="请输入数量"/></td>
                        </tr>
                        <tr>
                            <td>支付方式</td>
                            <td><input name="ordertype" value={orderset.ordertype} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入支付方式"/></td>
                        </tr>
                        <tr>
                            <td>用户名</td>
                            <td><input name="username" value={orderset.username} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入用户名"/></td>
                        </tr>
                        <tr>
                            <td>订单状态</td>
                            <td><input name="state" value={orderset.state} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入订单状态"/></td>
                        </tr>
                    </tbody>       
                </table>     
             </Modal>
         </>
        </div>
    )
}