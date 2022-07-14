import * as echarts from 'echarts';
import React from 'react'
import {getUserList} from '../../api/userlist'


export default class Listtel extends React.Component{

    constructor(){
        super()
        this.state ={    
            boy:0,
            girl:0       
        }
    }

    getAllData(){
        let boy = 0;
        let girl = 0;

        getUserList()
        .then(data=>{
            //异步的
            console.log("echarts里的data:",data);
            data.forEach((item,idx)=>{
                if(item.sex==="男"){
                    boy ++;
                }else{
                    girl ++;
                }
            })
            this.setState({
                boy:boy,
                girl:girl
            },()=>{
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));

                console.log('统计后的boy22',this.state.boy);
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '注册用户性别占比分析图',
                        left:"center",
                        top:8
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '8%',
                        left: 'center'
                    },
                    labelLine: {
                        show: true
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: this.state.boy, name: '男生'},
                                {value: this.state.girl, name: '女生'},
                            ]
                        }
                    ]
                });
            })
        })
        
    }

    componentDidMount(){
        //获取数据
        this.getAllData()
        
    }

    
    render(){
        return (
            <div id="main" style={{width:"500px",height:"500px"}}>

            </div>
        )
    }
}

