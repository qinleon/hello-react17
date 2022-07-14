import React from "react";
import './commuinfo.css'
import { Table, Button ,Modal,Input} from 'antd';
import Draggable from 'react-draggable';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {getUserComm,removeUserComm,addUserComm,updateUserComm} from '../../api/commuinfo'



export default class Commuinfo extends React.Component{    
    constructor(props){
        super();
        this.state = {
            columns:[
                {
                    title: '序号',
                    dataIndex: 'id',
                },
                {
                    title: '联系人',
                    dataIndex: 'username',
                },
                {
                    title: '联系电话',
                    dataIndex: 'tel',
                },
                {
                    title: '状态',
                    dataIndex: 'states',
                },
                {
                    title: '省市区',
                    dataIndex: 'local',
                },
                {
                    title: '街道地址',
                    dataIndex: 'adress',
                },
                {
                    title: '邮编',
                    dataIndex: 'mailcode',
                },
                {
                    title: 'QQ号',
                    dataIndex: 'qqcode',
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (text, record,index) => (
                      <><Button type="primary" onClick={()=>this.updateData(record)} >修改</Button>
                        <Button type="primary"onClick={()=>this.showConfirm(index)} >删除</Button>
                      </>
                  ),
                },
              ],              

            //原数据（获取到的数据）
            data:[], 
            visible: false,
            disabled: true,
            bounds: { left: 0, top: 0, bottom: 0, right: 0 },
            
            //双向绑定的（保存和修改公用）
            changeData:{
                "id":"",
                "username":"",
                "tel":"",
                "states":"待审核",
                "local":"",
                "adress":"",
                "mailcode":"",
                "qqcode":"",
                "email":""
            },
            //查询条件，双向绑定
            searchData:{
                username:""
            },
            visibleUpd:false,
            index:0
        }
    }

    draggleRef = React.createRef();

    //保存框部分
    showModal = () => {
        this.setState({
          visible: true,
        });
      };
    

    handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
          changeData:{
            "id":"",
            "username":"",
            "tel":"",
            "states":"待审核",
            "local":"",
            "adress":"",
            "mailcode":"",
            "qqcode":"",
            "email":""
        },
        });
      };


    onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = this.draggleRef?.current?.getBoundingClientRect();
    this.setState({
        bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y),
        },
    });
    };


    //修改框部分
    showModalUp = () => {
        this.setState({
            visibleUpd: false,
        });
      };
    

    handleCancelUp = e => {
        this.setState({
            visibleUpd: false,
            changeData:{
                "id":"",
                "username":"",
                "tel":"",
                "states":"待审核",
                "local":"",
                "adress":"",
                "mailcode":"",
                "qqcode":"",
                "email":""
            },
        });
      };


    onStartUp = (event, uiData) => {
        const { clientWidth, clientHeight } = window?.document?.documentElement;
        const targetRect = this.draggleRef?.current?.getBoundingClientRect();
        this.setState({
            bounds: {
            left: -targetRect?.left + uiData?.x,
            right: clientWidth - (targetRect?.right - uiData?.x),
            top: -targetRect?.top + uiData?.y,
            bottom: clientHeight - (targetRect?.bottom - uiData?.y),
            },
        });
    };


    //显示添加框
    showAddComm=()=>{
        this.showModal()
    }

    //模板渲染完成获取数据
    componentDidMount(){
        this.getAllData()
    }

    //获取全部数据
    getAllData(){
        getUserComm()
        .then(data=>{
            // console.log('data:',data);
            data.forEach((item,idx)=>{
                item.key = idx
            })
            this.setState({
                data:data
            })
        })
    }

    //添加数据
    addCommu=()=>{
        // console.log('点击保存了');
        addUserComm(this.state.changeData)
        .then(data=>{
            this.setState({
                changeData:{
                    "id":"",
                    "username":"",
                    "tel":"",
                    "states":"待审核",
                    "local":"",
                    "adress":"",
                    "mailcode":"",
                    "qqcode":"",
                    "email":""
                },
                visible: false,
            },()=>{
                this.getAllData()
            });
        })
        
    }

    //删除(ID值)
    removeData=(idx)=>{
        let id = this.state.data[idx].id
        removeUserComm(id)
        .then(()=>{
            this.getAllData()
        })
    }

    //查询
    findData=()=>{
        //参数为对象
        let username = this.state.searchData
        getUserComm(username)  
        .then(data=>{
            data.forEach((item,idx)=>{
                item.key = idx
            })
            this.setState({
                data:data
            })
        })
    }

    //更新
    updateData=(idx)=>{
        this.setState({
            visibleUpd:true,
            index:idx.id,
            changeData:idx
        })
    }

    //修改数据
    updDatas=()=>{
        let index = this.state.index
        updateUserComm(index,this.state.changeData)
        .then(data=>{
            this.setState({
                visibleUpd:false,
                changeData:{
                    "id":"",
                    "username":"",
                    "tel":"",
                    "states":"待审核",
                    "local":"",
                    "adress":"",
                    "mailcode":"",
                    "qqcode":"",
                    "email":""
                  }
            },()=>{
                this.getAllData()
            })
            
        })
    }

    //销毁确认框
    destroyAll=()=> {
        Modal.destroyAll();
    }

    //显示确认框
    showConfirm =(idx)=>{
        let that = this
        const { confirm } = Modal; 
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: <p>确定删除吗？</p>,
              onOk(){
                // console.log('onok函数里的this',this);
                that.removeData(idx)
              },
              onCancel(){
                that.destroyAll()
              } 
        })
    }

    //双向绑定（保存）
    changeVal=(e)=>{
        this.setState({
            changeData:{...this.state.changeData,[e.target.name]:e.target.value}
        })
    }

    //双向绑定（查询）
    changeSearch=(e)=>{
        this.setState({
            searchData:{
                ...this.state.searchData,
                [e.target.name]:e.target.value
            }
        })
    }
    
    render(){
        const {  disabled, visible } = this.state;

        return (
            <div className="commuinfo">
                <div className="list_title">
                    <h3>通讯信息</h3>
                    <Input size="large" onChange={this.changeSearch} name="username" value={this.state.searchData.username} allowClear="true" style={{width:"200px",marginLeft:"20px"}} placeholder="请输入用户名" />

                    <button className="sear" onClick={this.findData}>搜索</button>
                    <button onClick={this.showAddComm}>增加</button>             
                </div>

                <Table style={{marginTop:"15px"}} columns={this.state.columns} dataSource={this.state.data}></Table>                

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
                        this.setState({
                            disabled: false,
                        });
                        }
                    }}
                    onMouseOut={() => {
                        this.setState({
                        disabled: false,
                        });
                    }}
                    // fix eslintjsx-a11y/mouse-events-have-key-events
                    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                    onFocus={() => {}}
                    onBlur={() => {}}
                    // end
                    >
                    请添加通讯信息！
                    </div>
                }
                    visible={visible}
                    okText={'保存'}
                    width="550px"
                    bodyStyle={{height:"350px"}}
                    cancelText={'取消'}
                    onOk={this.addCommu}
                    onCancel={this.handleCancel}
                    modalRender={modal => (
                    <Draggable
                    disabled={this.state.disabled}
                    bounds={this.state.bounds}
                    onStart={(event, uiData) => this.onStart(event, uiData)}
                    >
                    <div ref={this.draggleRef}>{modal}</div>
                    </Draggable>
                )}
                >
              
                <br />
                {/* 保存 */}
                <table className="save_table">
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td><input name="id" value={this.state.changeData.id} onChange={this.changeVal} type="text" placeholder="请输入id名"/></td>
                        </tr>
                        <tr>
                            <td>用户名</td>
                            <td><input name="username" value={this.state.changeData.username} onChange={this.changeVal} type="text" placeholder="请输入用户名"/></td>
                        </tr>
                        <tr>
                            <td>联系电话</td>
                            <td><input name="tel" value={this.state.changeData.tel} onChange={this.changeVal} type="tel" placeholder="请输入联系电话"/></td>
                        </tr>   
                        <tr>
                            <td>状态</td>
                            <td><input name="states" value={this.state.changeData.states} onChange={this.changeVal} type="text" placeholder="请输入状态"/></td>
                        </tr>
                        <tr>
                            <td>省市区</td>
                            <td><input name="local" value={this.state.changeData.local} onChange={this.changeVal} type="text" placeholder="请输入省市区"/></td>
                        </tr>
                        <tr>
                            <td>街道地址</td>
                            <td><input name="adress" value={this.state.changeData.adress} onChange={this.changeVal} type="text" placeholder="请输入街道地址"/></td>
                        </tr>
                        <tr>
                            <td>邮编</td>
                            <td><input name="mailcode" value={this.state.changeData.mailcode} onChange={this.changeVal} type="text" placeholder="请输入邮编"/></td>
                        </tr>
                        <tr>
                            <td>QQ号</td>
                            <td><input name="qqcode" value={this.state.changeData.qqcode} onChange={this.changeVal} type="text" placeholder="请输入QQ号"/></td>
                        </tr>
                        <tr>
                            <td>邮箱</td>
                            <td><input name="email" value={this.state.changeData.email} onChange={this.changeVal} type="email" placeholder="请输入邮箱"/></td>
                        </tr>
                    </tbody>       
                </table>
         
                </Modal>
            </>

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
                        this.setState({
                            disabled: false,
                        });
                        }
                    }}
                    onMouseOut={() => {
                        this.setState({
                        disabled: true,
                        });
                    }}
                    // fix eslintjsx-a11y/mouse-events-have-key-events
                    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                    onFocus={() => {}}
                    onBlur={() => {}}
                    // end
                    >
                    请修改通讯信息！
                    </div>
                }
                    visible={this.state.visibleUpd}
                    okText={'修改'}
                    width="550px"
                    bodyStyle={{height:"350px"}}
                    cancelText={'取消'}
                    onOk={this.updDatas}
                    onCancel={this.handleCancelUp}
                    modalRender={modal => (
                    <Draggable
                    disabled={this.state.disabled}
                    bounds={this.state.bounds}
                    onStart={(event, uiData) => this.onStartUp(event, uiData)}
                    >
                    <div ref={this.draggleRef}>{modal}</div>
                    </Draggable>
                )}
                >
               
                <br />

                {/* 修改 */}
               <table className="update_tables">
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td><input name="id" value={this.state.changeData.id} onChange={this.changeVal} type="text" placeholder="请输入id名"/></td>
                        </tr>
                        <tr>
                            <td>用户名</td>
                            <td><input name="username" value={this.state.changeData.username} onChange={this.changeVal} type="text" placeholder="请输入用户名"/></td>
                        </tr>
                        <tr>
                            <td>联系电话</td>
                            <td><input name="tel" value={this.state.changeData.tel} onChange={this.changeVal} type="tel" placeholder="请输入联系电话"/></td>
                        </tr>   
                        <tr>
                            <td>状态</td>
                            <td><input name="states" value={this.state.changeData.states} onChange={this.changeVal} type="text" placeholder="请输入状态"/></td>
                        </tr>
                        <tr>
                            <td>省市区</td>
                            <td><input name="local" value={this.state.changeData.local} onChange={this.changeVal} type="text" placeholder="请输入省市区"/></td>
                        </tr>
                        <tr>
                            <td>街道地址</td>
                            <td><input name="adress" value={this.state.changeData.adress} onChange={this.changeVal} type="text" placeholder="请输入街道地址"/></td>
                        </tr>
                        <tr>
                            <td>邮编</td>
                            <td><input name="mailcode" value={this.state.changeData.mailcode} onChange={this.changeVal} type="text" placeholder="请输入邮编"/></td>
                        </tr>
                        <tr>
                            <td>QQ号</td>
                            <td><input name="qqcode" value={this.state.changeData.qqcode} onChange={this.changeVal} type="text" placeholder="请输入QQ号"/></td>
                        </tr>
                        <tr>
                            <td>邮箱</td>
                            <td><input name="email" value={this.state.changeData.email} onChange={this.changeVal} type="email" placeholder="请输入邮箱"/></td>
                        </tr>
                    </tbody>       
                </table>

                {/* 修改 */}
                </Modal>
            </>
        </div>
        )        
    }
}