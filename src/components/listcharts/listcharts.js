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
                var myChart = echarts.init(document.getElementById('listmain'));

                console.log('统计后的boy22',this.state.boy);
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '注册用户年龄分析',
                        left:"center",
                        top:8
                    },
                    xAxis: {
                        type: 'category',
                        splitNumber:10,
                        name:"年龄分布",
                        data: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70','70-80','80-90','90-100'],
                        axisTick: {
                            length: 10,
                            interval:0,
                            show:true,
                            lineStyle: {
                              type: 'dashed'
                              // ...
                            }
                          }
                    },
                    yAxis: {
                        type: 'value',
                        name:"人数",
                        axisTick: {
                            length: 10,
                            lineStyle: {
                              type: 'dashed'
                              // ...
                            }
                          }
                    },
                    series: [{
                        data: [120, 200, 150, 80, 70, 110, 130,45,87,90],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    }]
            
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
            <div id="listmain" style={{width:"600px",height:"500px"}}>
               
            </div>
        )
    }
}

