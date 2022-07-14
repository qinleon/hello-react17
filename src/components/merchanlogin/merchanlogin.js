import * as echarts from 'echarts';
import React from 'react'
import { getLoginaccou } from '../../api/loginaccou'

var legendData = [];//记录部门分类


export default class Merchanstati extends React.Component {

    constructor() {
        super()
    }

    //数组去重
    getOnlyArr(arr) {
        let newarr = []
        for (let i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
                newarr.push(arr[i])
            }
        }
        return newarr;
    }

    //获取所有数据
    async getAllData() {

        let data = await getLoginaccou()
        console.log('data',data);
        data.forEach((item) => {
            legendData.push(item.department)
            // seriesData.push({
            //     name: item.merchanname,
            //     value: item.cost
            // })
        })

        legendData= this.getOnlyArr(legendData)
        console.log('legendData',legendData);

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('merchanlogin'));

        myChart.setOption({
            title: {
                text: '商户部门登录分析'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['部门登录分析']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: legendData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '部门登录分析',
                    type: 'line',
                    stack: '总量',
                    data: [120, 132, 101, 134, 90, 230, 210]
                }
            ]
        })

    }
    componentDidMount() {

        this.getAllData()
    }

    render() {
        return (
            <div id="merchanlogin" style={{ width: "100%", height: "100%" }}>

            </div>

        )
    }


}








