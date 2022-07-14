import React from "react";
import './userlist.css'
import { Table, Button ,Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {getUserList, removeUserList, addUserList, updateUserList} from '../../api/userlist'

export default class Userlist extends React.Component{    
    constructor(props){
        super();
        this.state = {
            columns:[
                {
                    title: '序号',
                    dataIndex: 'id',
                },
                {
                    title: '用户名',
                    dataIndex: 'username',
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                },
                {
                    title: '年龄',
                    dataIndex: 'age',
                },
                {
                    title: '手机号',
                    dataIndex: 'tel',
                },
                {
                    title: '注册时间',
                    dataIndex: 'regist_time',
                },
                {
                    title: '登录次数',
                    dataIndex: 'ligin_count',
                },
                {
                    title: '积分',
                    dataIndex: 'code',
                },
                {
                    title: 'IP地址',
                    dataIndex: 'ip_adress',
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (text, record,index) => (
                      <><Button type="primary" onClick={()=>this.updateData(record)} >修改</Button>
                        <Button type="primary" onClick={()=>this.showConfirm(index)} >删除</Button>
                      </>
                  ),
                },
              ],              

              data:[],
              isshowAdd:'none',
              isshowUpdate:'none',

              //当前修改的哪条数据
              index:0,
              modelData:{
                "id": '',
                "tel": '',
                "username": "",
                "age": '',
                "sex": "",
                "regist_time": "",
                "ligin_count": '15',
                "code": '700',
                "ip_adress": ""
              },

              //查询条件，双向绑定
              findParams:{
                  username:""
              },
              top: 'topLeft',
              bottom: 'bottomRight',
              
              //当前用户权限
              curd:localStorage.getItem('curd')
        }
    }

    showAdd=()=>{
        //显示添加
        this.setState({
            isshowAdd:'block'
        })
    }

    exitUpd=()=>{
        //隐藏修改框
        this.setState({
            isshowUpdate:'none',
            modelData:{
                "id": '',
                "tel": '',
                "username": "",
                "age": '',
                "sex": "",
                "regist_time": "",
                "ligin_count": '15',
                "code": '700',
                "ip_adress": ""
              }
        })
    }

    exitAdd=()=>{
        //隐藏添加
        this.setState({
            isshowAdd:'none'
        })
    }

    removeData=(idx)=>{
        //删除
        console.log('remove里的idx',idx);
        removeUserList(this.state.data[idx].id)
        .then(data=>{
            this.getAllData()
        })    
    }

    upDate=()=>{
        //修改指定数据
        let index = this.state.index
        console.log('index:',index);
        updateUserList(index,this.state.modelData)
        .then(data=>{
            this.setState({
                isshowUpdate:'none',
                modelData:{
                    "id": "",
                    "tel": "",
                    "username": "",
                    "age": "",
                    "sex": "",
                    "regist_time": "",
                    "ligin_count": 15,
                    "code": 700,
                    "ip_adress": "127.0.0.1"
                  }
            },()=>{
                console.log('this.state.modelData',this.state.modelData);
                this.getAllData()
            })
            
        })
    }

    updateData=(idx)=>{
        //显示修改框，并更新当前修改的index及双向绑定的数据
        this.setState({
            isshowUpdate:'block',
            index:idx.id,
            modelData:idx
        })
    }

    //获取所有数据
    getAllData() {
        getUserList().then(data=>{
            // console.log('渲染后查询所有data:',data);
            data.forEach((item,idx)=>{
                item.key = idx
            })
            this.setState({
                data:data
            })
        })
    }
    
    //渲染完毕即获取数据
    componentDidMount(){
        this.getAllData()
    }

    //双向绑定（添加弹框里输入框的值）
    changeVal=(ev)=>{
        this.setState({
            modelData:{...this.state.modelData,[ev.target.name]:ev.target.value}
        })
    }

    //双向绑定（查询条件）
    changeFind=(ev)=>{
        this.setState({
            findParams:{...this.state.findParams,[ev.target.name]:ev.target.value}
        })
    }
    
    //添加数据
    addUser=()=>{
        addUserList(this.state.modelData)
        .then(data=>{
            this.setState({
                isshowAdd:"none",            
                modelData:{
                    "id": '',
                    "tel": '',
                    "username": "",
                    "age": '',
                    "sex": "",
                    "regist_time": "",
                    "ligin_count": '15',
                    "code": '700',
                    "ip_adress": "127.0.0.1"
                  }
            },()=>{
                this.getAllData();
            });    
        });  
    }

    //查询（点击时按条件查询)
    getByParams=()=>{
        //已经规定传的参数为对象
        let params = this.state.findParams
        // console.log('params:',params);
        getUserList(params)
        .then(data=>{
            data.forEach((item,idx)=>{
                item.key = idx
            })
            this.setState({
                data:data
            },()=>{
                // console.log('查询后state里的data:',this.state.data);
            })
        })
    }

    //销毁确认框
    destroyAll=()=> {
        Modal.destroyAll();
    }

    showConfirm =(idx)=>{
        let that = this
        const { confirm } = Modal; 
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: <p>确定删除吗？</p>,
              onOk(){
                that.removeData(idx)
              },
              onCancel(){
                that.destroyAll()
              } 
        })
      }

    render(){
        
        return (
            <div className="userlist">
                <div className="list_title">
                    <h3>用户列表</h3>
                    <input type="text" name="username" value={this.state.findParams.username} onChange={this.changeFind} id="sear_ipt" placeholder="请输入用户名"/>

                    <button className="sear" onClick={this.getByParams}>搜索</button>
                    {/* <button className="shai">筛选</button> */}
                    <button onClick={this.showAdd}>增加</button>             
                </div>  
                <Table columns={this.state.columns} dataSource={this.state.data}></Table>                
                
                {/* 添加数据 */}
                <table className="add_table" style={{display:this.state.isshowAdd}}>
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td><input name="id" value={this.state.modelData.id} onChange={this.changeVal} type="text" placeholder="请输入id名"/></td>
                        </tr>
                        <tr>
                            <td>用户名</td>
                            <td><input name="username" value={this.state.modelData.username} onChange={this.changeVal} type="text" placeholder="请输入用户名"/></td>
                        </tr>
                        <tr>
                            <td>性别</td>
                            <td><input name="sex" value={this.state.modelData.sex} onChange={this.changeVal} type="text" placeholder="请输入性别"/></td>
                        </tr>   
                        <tr>
                            <td>年龄</td>
                            <td><input name="age" value={this.state.modelData.age} onChange={this.changeVal} type="text" placeholder="请输入年龄"/></td>
                        </tr>
                        <tr>
                            <td>手机号</td>
                            <td><input name="tel" value={this.state.modelData.tel} onChange={this.changeVal} type="tel" placeholder="请输入手机号"/></td>
                        </tr>
                        <tr>
                            <td>注册时间</td>
                            <td><input name="regist_time" value={this.state.modelData.regist_time} onChange={this.changeVal} type="date" placeholder="请输入注册时间"/></td>
                        </tr>
                        <tr>
                            <td>IP地址</td>
                            <td><input name="ip_adress" value={this.state.modelData.ip_adress} onChange={this.changeVal} type="text" placeholder="请输入IP地址"/></td>
                        </tr>
                        <tr>
                            <td>
                                <button value="取消" onClick={this.exitAdd}>取消</button>
                            </td>
                            <td>
                                <button value="保存" onClick={this.addUser}>保存</button>
                            </td>
                        </tr>
                    </tbody>       
                </table>

                {/* 修改数据 */}
                <table className="update_table" style={{display:this.state.isshowUpdate}}>
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td><input name="id" value={this.state.modelData.id} onChange={this.changeVal} type="text" placeholder="请输入id名"/></td>
                        </tr>
                        <tr>
                            <td>用户名</td>
                            <td><input name="username" value={this.state.modelData.username} onChange={this.changeVal} type="text" placeholder="请输入用户名"/></td>
                        </tr>
                        <tr>
                            <td>性别</td>
                            <td><input name="sex" value={this.state.modelData.sex} onChange={this.changeVal} type="text" placeholder="请输入性别"/></td>
                        </tr>   
                        <tr>
                            <td>年龄</td>
                            <td><input name="age" value={this.state.modelData.age} onChange={this.changeVal} type="text" placeholder="请输入年龄"/></td>
                        </tr>
                        <tr>
                            <td>手机号</td>
                            <td><input name="tel" value={this.state.modelData.tel} onChange={this.changeVal} type="tel" placeholder="请输入手机号"/></td>
                        </tr>
                        <tr>
                            <td>注册时间</td>
                            <td><input name="regist_time" value={this.state.modelData.regist_time} onChange={this.changeVal} type="date" placeholder="请输入注册时间"/></td>
                        </tr>
                        <tr>
                            <td>IP地址</td>
                            <td><input name="ip_adress" value={this.state.modelData.ip_adress} onChange={this.changeVal} type="text" placeholder="请输入IP地址"/></td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={this.exitUpd} value="取消">取消</button>
                            </td>
                            <td>
                                <button onClick={this.upDate} value="修改">修改</button>
                            </td>
                        </tr>
                    </tbody>       
                </table>
            </div>
        )        
    }
}