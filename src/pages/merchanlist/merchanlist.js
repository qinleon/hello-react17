import React from "react";
import './merchanlist.css'
import { Table, Button ,Modal,Input} from 'antd';
import Draggable from 'react-draggable';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {getmerchanlist,removemerchanlist,addmerchanlist,updatemerchanlist} from '../../api/merchanlist'



export default class Commuinfo extends React.Component{    
    constructor(props){
        super();
        this.state = {
            columns:[
                {
                    title: '商户ID',
                    dataIndex: 'id',
                },
                {
                    title: '商户名称',
                    dataIndex: 'merchanname',
                },
                {
                    title: '经营品类',
                    dataIndex: 'type',
                },
                {
                    title: '人均消费(元)',
                    dataIndex: 'cost',
                },
                {
                    title: '好评率(%)',
                    dataIndex: 'commrating',
                },
                {
                    title: '所在位置',
                    dataIndex: 'local',
                },
                {
                    title: '地区排名(.No)',
                    dataIndex: 'num',
                },    
                {
                    title: '交通路线',
                    dataIndex: 'tranroute',
                },
                {
                    title: '门店电话',
                    dataIndex: 'tel',
                },
                {
                    title: '联系人',
                    dataIndex: 'username',
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
                "merchanname":"",
                "type":"",
                "cost":"",
                "commrating":"",
                "local":"",
                "num":"",
                "tranroute":"",
                "tel":"",
                "username":""
            },
            //查询条件，双向绑定
            searchData:{
                id:""
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
        this.setState({
          visible: false,
          changeData:{
            "id":"",
            "merchanname":"",
            "type":"",
            "cost":"",
            "commrating":"",
            "local":"",
            "num":"",
            "tranroute":"",
            "tel":"",
            "username":""
          }
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
            visibleUpd: true,
        });
      };
    

    handleCancelUp = e => {
        // console.log(e);
        this.setState({
            visibleUpd: false,
            changeData:{
                "id":"",
                "merchanname":"",
                "type":"",
                "cost":"",
                "commrating":"",
                "local":"",
                "num":"",
                "tranroute":"",
                "tel":"",
                "username":""
              }
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

    //获取全部数据(async)
    async getAllData(){

        let data = await getmerchanlist()
        data.forEach((item,idx)=>{
            item.key = idx
        })
        this.setState({
            data:data
        })
    }

    //添加数据
    async addCommu(){
        await addmerchanlist(this.state.changeData)
        this.setState({
            changeData:{
                "id":"",
                "merchanname":"",
                "type":"",
                "cost":"",
                "commrating":"",
                "local":"",
                "num":"",
                "tranroute":"",
                "tel":"",
                "username":""
            },
            visible: false,
        },()=>{
            this.getAllData()
        });
        
    }

    // 删除(ID值)
    async removeData(idx){
        let id = this.state.data[idx].id
        await removemerchanlist(id)
        this.getAllData()
    }

    //查询
    async findData(){
        //参数为对象
        let id = this.state.searchData
        let data = await getmerchanlist(id)
        data.forEach((item,idx)=>{
            item.key = idx
        })
        this.setState({
            data:data
        })
    }

    // 更新
    updateData=(idx)=>{
        this.setState({
            visibleUpd:true,
            index:idx.id,
            changeData:idx
        })
    }

    //修改数据
    async updDatas(){
        let index = this.state.index
        await updatemerchanlist(index,this.state.changeData)
        // console.log('this.state.changeData.id',this.state.changeData.id);
        this.setState({
            visibleUpd:false,
            changeData:{
                "id":"",
                "merchanname":"",
                "type":"",
                "cost":"",
                "commrating":"",
                "local":"",
                "num":"",
                "tranroute":"",
                "tel":"",
                "username":""
              }
        },()=>{
            // console.log('this.state.data[index].id',this.state.data[index].id);
            this.getAllData()
        })     
    }


    //销毁确认框
    destroyAll=()=> {
        Modal.destroyAll();
    }

    // 显示确认框
    showConfirm =(idx)=>{
        let that = this
        const { confirm } = Modal; 
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: <p>确定删除吗？</p>,
              onOk(){
                console.log('onok函数里的this',this);
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
        const { disabled } = this.state;

        return (
            <div className="commuinfo">
                <div className="list_title">
                    <h3>商户列表</h3>
                    <Input size="large" onChange={this.changeSearch} name="id" value={this.state.searchData.id} allowClear="true" style={{width:"200px",marginLeft:"20px"}} placeholder="请输入用户名" />

                    <button className="sear" onClick={()=>this.findData()}>搜索</button>
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
                    请添加商户列表！
                    </div>
                }
                    visible={this.state.visible}
                    okText={'保存'}
                    width="550px"
                    bodyStyle={{height:"350px"}}
                    cancelText={'取消'}
                    onOk={()=>this.addCommu()}
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
                <p>
                </p>
                <br />
                {/* 保存 */}
                <table className="addAll_table">
                    <tbody>
                        <tr>
                            <td>商户ID</td>
                            <td><input name="id" value={this.state.changeData.id} onChange={this.changeVal} type="text" placeholder="请输入商户ID"/></td>
                        </tr>
                        <tr>
                            <td>商户名称</td>
                            <td><input name="merchanname" value={this.state.changeData.merchanname} onChange={this.changeVal} type="text" placeholder="请输入商户名称"/></td>
                        </tr>
                        <tr>
                            <td>经营品类</td>
                            <td><input name="type" value={this.state.changeData.type} onChange={this.changeVal} type="text" placeholder="请输入经营品类"/></td>
                        </tr>   
                        <tr>
                            <td>人均消费</td>
                            <td><input name="cost" value={this.state.changeData.cost} onChange={this.changeVal} type="text" placeholder="请输入人均消费"/></td>
                        </tr>
                        <tr>
                            <td>好评率</td>
                            <td><input name="commrating" value={this.state.changeData.commrating} onChange={this.changeVal} type="text" placeholder="请输入好评率"/></td>
                        </tr>
                        <tr>
                            <td>所在位置</td>
                            <td><input name="local" value={this.state.changeData.local} onChange={this.changeVal} type="text" placeholder="请输入所在位置"/></td>
                        </tr>
                        <tr>
                            <td>地区排名</td>
                            <td><input name="num" value={this.state.changeData.num} onChange={this.changeVal} type="text" placeholder="请输入地区排名"/></td>
                        </tr>
                        <tr>
                            <td>交通路线</td>
                            <td><input name="tranroute" value={this.state.changeData.tranroute} onChange={this.changeVal} type="text" placeholder="请输入交通路线"/></td>
                        </tr>
                        <tr>
                            <td>门店电话</td>
                            <td><input name="tel" value={this.state.changeData.tel} onChange={this.changeVal} type="text" placeholder="请输入门店电话"/></td>
                        </tr>
                        <tr>
                            <td>联系人</td>
                            <td><input name="username" value={this.state.changeData.username} onChange={this.changeVal} type="text" placeholder="请输入联系人"/></td>
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
                        disabled: false,
                        });
                    }}
                    // fix eslintjsx-a11y/mouse-events-have-key-events
                    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                    onFocus={() => {}}
                    onBlur={() => {}}
                    // end
                    >
                    请修改商户列表！
                    </div>
                }
                    visible={this.state.visibleUpd}
                    okText={'修改'}
                    width="550px"
                    bodyStyle={{height:"350px"}}
                    cancelText={'取消'}
                    onOk={()=>this.updDatas()}
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
                <p>
                </p>
                <br />
                {/* 修改 */}
                <table className="set_table">
                    <tbody>
                        <tr>
                            <td>商户ID</td>
                            <td><input name="id" value={this.state.changeData.id} onChange={this.changeVal} type="text" placeholder="请输入商户ID"/></td>
                        </tr>
                        <tr>
                            <td>商户名称</td>
                            <td><input name="merchanname" value={this.state.changeData.merchanname} onChange={this.changeVal} type="text" placeholder="请输入商户名称"/></td>
                        </tr>
                        <tr>
                            <td>经营品类</td>
                            <td><input name="type" value={this.state.changeData.type} onChange={this.changeVal} type="text" placeholder="请输入经营品类"/></td>
                        </tr>   
                        <tr>
                            <td>人均消费</td>
                            <td><input name="cost" value={this.state.changeData.cost} onChange={this.changeVal} type="text" placeholder="请输入人均消费"/></td>
                        </tr>
                        <tr>
                            <td>好评率</td>
                            <td><input name="commrating" value={this.state.changeData.commrating} onChange={this.changeVal} type="text" placeholder="请输入好评率"/></td>
                        </tr>
                        <tr>
                            <td>所在位置</td>
                            <td><input name="local" value={this.state.changeData.local} onChange={this.changeVal} type="text" placeholder="请输入所在位置"/></td>
                        </tr>
                        <tr>
                            <td>地区排名</td>
                            <td><input name="num" value={this.state.changeData.num} onChange={this.changeVal} type="text" placeholder="请输入地区排名"/></td>
                        </tr>
                        <tr>
                            <td>交通路线</td>
                            <td><input name="tranroute" value={this.state.changeData.tranroute} onChange={this.changeVal} type="text" placeholder="请输入交通路线"/></td>
                        </tr>
                        <tr>
                            <td>门店电话</td>
                            <td><input name="tel" value={this.state.changeData.tel} onChange={this.changeVal} type="text" placeholder="请输入门店电话"/></td>
                        </tr>
                        <tr>
                            <td>联系人</td>
                            <td><input name="username" value={this.state.changeData.username} onChange={this.changeVal} type="text" placeholder="请输入联系人"/></td>
                        </tr>
                    </tbody>       
                </table>


            
                </Modal>
            </>
        </div>
        )        
    }
}