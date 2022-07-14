import { Table, Button ,Modal,Input} from 'antd';
import React from 'react'
import Draggable from 'react-draggable';
import {useState,useEffect} from 'react'
import {getLoginaccou,removeLoginaccou,addLoginaccou,updateLoginaccou} from '../../api/loginaccou'
import { ExclamationCircleOutlined } from '@ant-design/icons';


import './loginaccou.css'

var draggleRef = React.createRef();


export default function Loginaccou(props) {

    let columns = [
        {
            title: '商户ID',
            dataIndex: 'id',
        },
        {
            title: '商户名称',
            dataIndex: 'name',
        },
        {
            title: '账户名',
            dataIndex: 'accouname',
        },
        {
            title: '手机号',
            dataIndex: 'tel',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '开通时间',
            dataIndex: 'registime',
        },
        {
            title: '类型',
            dataIndex: 'root',
        },    
        {
            title: '权限级别',
            dataIndex: 'roottype',
        },
        {
            title: '状态',
            dataIndex: 'state',
        },
        {
            title: '姓名',
            dataIndex: 'username',
        }, 
        {
            title: '工号',
            dataIndex: 'workcode',
        }, 
        {
            title: '部门',
            dataIndex: 'department',
        },     
        {
            title: '职位',
            dataIndex: 'position',
        },
        {
            title: '登录次数',
            dataIndex: 'logincount',
        },
        {
            title: '下单数(单)',
            dataIndex: 'order',
        },
        {
            title: '安全等级',
            dataIndex: 'safelevel',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record,index) => (
              <><Button type="primary" onClick={()=>updateData(index)} >修改</Button>
                <Button type="primary"onClick={()=>showConfirm(record.id)} >删除</Button>
              </>
          ),
        },
      ]

    //loginaccdata为原始数据，初始为空数组，setloginaccdata为更新初始值状态函数
    let [loginaccdata,setloginaccdata] = useState([])

    //显示修改框和添加框
    let [showK,changeK] = useState({
        visible:false,
        visibleUp:false,
        disabled:true,
        bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    })

    //解构
    let {visible,visibleUp,disabled,bounds} = showK
    // console.log('bounds',bounds);

    //记录当前修改的数据下标,useState返回的是数组
    let [index,changeIndex] = useState(0)

    //修改框，添加框双向绑定的数据
    let [changeData,setChangedata] = useState({
            "id": "",
            "name": "",
            "accouname": "",
            "tel": "",
            "email": "",
            "registime": "",
            "root": "管理员",
            "roottype": "所有权限",
            "state": "",
            "username": "",
            "workcode": "",
            "department": "",
            "position": "",
            "logincount": "",
            "order": "",
            "safelevel": ""
    })

    //搜索框双向绑定的数据
    let [queryObj,changeQue] = useState({
        'id':""
    })

    //保存框部分
    function showModal(){
        changeK({
            ...showK,
            visible: true
        })
      };
    
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

    //修改框部分
    function showModalUp(){
        changeK({
            ...showK,
            visibleUp: true
        })
      };
    
    function handleCancelUp(e){
        changeK({
            ...showK,
            visibleUp: false
        })
      };

    function onStartUp(event, uiData){
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

    
    //获取全部数据
    async function getAllData() {
        let data = await getLoginaccou()
        data.forEach((item,idx)=>{
            item.key = idx
        })
        setloginaccdata(data)
    }

    //带两个参数的，首次渲染完毕才执行该函数,[]指不依赖任何参数
    useEffect(()=>{
        getAllData()
    },[])

    //显示删除确认框
    function showConfirm(id){
        const { confirm } = Modal; 
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: <p>确定删除吗？</p>,
              onOk(){
                removeData(id)
              },
              onCancel(){
                destroyAll()
              } 
        })
    }

    //删除数据
    async function removeData(idx){
        //idx就是要删除的数据id
        await removeLoginaccou(idx)
        getAllData()
    }

    //销毁删除确认框
    function destroyAll(){
        Modal.destroyAll();
    }

    //显示修改框
    function updateData(index){
        showModalUp()
        setChangedata(loginaccdata[index])
        changeIndex(index)
    }

    //显示添加框
    function showAdd() {
        showModal()
    }

    //添加数据
    async function addCommu(){
        await addLoginaccou(changeData)
        //清空双向绑定的数据
        setChangedata({
            "id": "",
            "name": "",
            "accouname": "",
            "tel": "",
            "email": "",
            "registime": "",
            "root": "管理员",
            "roottype": "所有权限",
            "state": "",
            "username": "",
            "workcode": "",
            "department": "",
            "position": "",
            "logincount": "",
            "order": "",
            "safelevel": ""
    })  
        handleCancel()
        getAllData()
    }

    //修改数据
    async function update() {
        let id = loginaccdata[index].id
        await updateLoginaccou(id,changeData)
        //清空双向绑定的数据
        setChangedata({
            "id": "",
            "name": "",
            "accouname": "",
            "tel": "",
            "email": "",
            "registime": "",
            "root": "管理员",
            "roottype": "所有权限",
            "state": "",
            "username": "",
            "workcode": "",
            "department": "",
            "position": "",
            "logincount": "",
            "order": "",
            "safelevel": ""
    })
            handleCancelUp()
            getAllData()
    }

    //搜索数据（条件搜索 id）
    async function searchData(){
        let data = await getLoginaccou(queryObj)
        data.forEach((item,idx)=>{
            item.key = idx
        })
        setloginaccdata(data)
    }

    //保存及修改的双向绑定函数
    function changeVal(e){
        setChangedata({
            ...changeData,
            [e.target.name]:e.target.value
        })
    }

    //查询条件的双向绑定函数
    function changeValQ(e) {
        changeQue({
            ...queryObj,
            [e.target.name]:e.target.value
        })
    }

    return (
    
        

        <div className="loginacclist">
            <div className="loginacc">
                    <h3>登录账户</h3>
                    <Input size="large" name="id" allowClear="true" onChange={(e)=>changeValQ(e)} value={queryObj.id} style={{width:"200px",marginLeft:"20px"}} placeholder="请输入用户名" />
                    <button className="sear" onClick={()=>searchData()}>搜索</button>
                    <button onClick={()=>showAdd()}>增加</button>             
            </div>
            <Table style={{marginTop:"15px"}} columns={columns} dataSource={loginaccdata}></Table>                

        {/* 添加框 */}
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
                 请添加登录账户！
                 </div>
             }
                 visible={visible}
                 okText={'保存'}
                 width="680px"
                 bodyStyle={{height:"580px"}}
                 cancelText={'取消'}
                 onOk={()=>addCommu()}
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
             
             {/* 保存 */}
             <table className="savet">
                 <tbody>
                     <tr>
                         <td>商户ID</td>
                         <td><input name="id" value={changeData.id} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入商户ID"/></td>
                     </tr>
                     <tr>
                         <td>商户名称</td>
                         <td><input name="name" value={changeData.name} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入商户名称"/></td>
                     </tr>
                     <tr>
                         <td>账户名</td>
                         <td><input name="accouname" value={changeData.accouname} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入账户名"/></td>
                     </tr>   
                     <tr>
                         <td>手机号</td>
                         <td><input name="tel" value={changeData.tel} onChange={(e)=>changeVal(e)} type="tel" placeholder="请输入手机号"/></td>
                     </tr>
                     <tr>
                         <td>邮箱</td>
                         <td><input name="email" value={changeData.email} onChange={(e)=>changeVal(e)} type="email" placeholder="请输入邮箱"/></td>
                     </tr>
                     <tr>
                         <td>开通时间</td>
                         <td><input name="registime" value={changeData.registime} onChange={(e)=>changeVal(e)} type="date" placeholder="请输入开通时间"/></td>
                     </tr>
                     <tr>
                         <td>类型(管理员)</td>
                         <td><input name="root" value={changeData.root} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入类型"/></td>
                     </tr>
                     <tr>
                         <td>权限级别(所有)</td>
                         <td><input name="roottype" value={changeData.roottype} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入权限级别"/></td>
                     </tr>
                     <tr>
                         <td>状态(启用/禁用)</td>
                         <td><input name="state" value={changeData.state} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入状态"/></td>
                     </tr>
                     <tr>
                         <td>姓名</td>
                         <td><input name="username" value={changeData.username} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入姓名"/></td>
                     </tr>
                     <tr>
                         <td>工号</td>
                         <td><input name="workcode" value={changeData.workcode} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入工号"/></td>
                     </tr>
                     <tr>
                         <td>部门</td>
                         <td><input name="department" value={changeData.department} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入部门"/></td>
                     </tr>
                     <tr>
                         <td>职位</td>
                         <td><input name="position" value={changeData.position} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入职位"/></td>
                     </tr>
                     <tr>
                         <td>登录次数</td>
                         <td><input name="logincount" value={changeData.logincount} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入登录次数"/></td>
                     </tr>
                     <tr>
                         <td>下单数(单)</td>
                         <td><input name="order" value={changeData.order} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入下单数(单)"/></td>
                     </tr>
                     <tr>
                         <td>安全级别(低/中/高)</td>
                         <td><input name="safelevel" value={changeData.safelevel} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入安全级别"/></td>
                     </tr>
                 </tbody>       
             </table>

             
             </Modal>
         </>


         {/* 修改框 */}
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
                 请修改登录账户！
                 </div>
             }
                 visible={visibleUp}
                 okText={'修改'}
                 width="680px"
                 bodyStyle={{height:"580px"}}
                 cancelText={'取消'}
                 onOk={()=>update()}
                 onCancel={()=>handleCancelUp()}
                 modalRender={modal => (
                 <Draggable
                 disabled={disabled}
                 bounds={bounds}
                 onStart={(event, uiData) => onStartUp(event, uiData)}
                 >
                 <div ref={draggleRef}>{modal}</div>
                 </Draggable>
             )}
             >
             
             {/* 保存 */}
             <table className="savet">
                 <tbody>
                     <tr>
                         <td>商户ID</td>
                         <td><input name="id" value={changeData.id} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入商户ID"/></td>
                     </tr>
                     <tr>
                         <td>商户名称</td>
                         <td><input name="name" value={changeData.name} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入商户名称"/></td>
                     </tr>
                     <tr>
                         <td>账户名</td>
                         <td><input name="accouname" value={changeData.accouname} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入账户名"/></td>
                     </tr>   
                     <tr>
                         <td>手机号</td>
                         <td><input name="tel" value={changeData.tel} onChange={(e)=>changeVal(e)} type="tel" placeholder="请输入手机号"/></td>
                     </tr>
                     <tr>
                         <td>邮箱</td>
                         <td><input name="email" value={changeData.email} onChange={(e)=>changeVal(e)} type="email" placeholder="请输入邮箱"/></td>
                     </tr>
                     <tr>
                         <td>开通时间</td>
                         <td><input name="registime" value={changeData.registime} onChange={(e)=>changeVal(e)} type="date" placeholder="请输入开通时间"/></td>
                     </tr>
                     <tr>
                         <td>类型(管理员)</td>
                         <td><input name="root" value={changeData.root} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入类型"/></td>
                     </tr>
                     <tr>
                         <td>权限级别(所有)</td>
                         <td><input name="roottype" value={changeData.roottype} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入权限级别"/></td>
                     </tr>
                     <tr>
                         <td>状态(启用/禁用)</td>
                         <td><input name="state" value={changeData.state} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入状态"/></td>
                     </tr>
                     <tr>
                         <td>姓名</td>
                         <td><input name="username" value={changeData.username} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入姓名"/></td>
                     </tr>
                     <tr>
                         <td>工号</td>
                         <td><input name="workcode" value={changeData.workcode} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入工号"/></td>
                     </tr>
                     <tr>
                         <td>部门</td>
                         <td><input name="department" value={changeData.department} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入部门"/></td>
                     </tr>
                     <tr>
                         <td>职位</td>
                         <td><input name="position" value={changeData.position} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入职位"/></td>
                     </tr>
                     <tr>
                         <td>登录次数</td>
                         <td><input name="logincount" value={changeData.logincount} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入登录次数"/></td>
                     </tr>
                     <tr>
                         <td>下单数(单)</td>
                         <td><input name="order" value={changeData.order} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入下单数(单)"/></td>
                     </tr>
                     <tr>
                         <td>安全级别(低/中/高)</td>
                         <td><input name="safelevel" value={changeData.safelevel} onChange={(e)=>changeVal(e)} type="text" placeholder="请输入安全级别"/></td>
                     </tr>
                 </tbody>       
             </table>          
             </Modal>
         </>
        </div>
    )
}

