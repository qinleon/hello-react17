import * as echarts from 'echarts'
import React from 'react'
import { getmerchanlist } from '../../api/merchanlist'

var legendData = []
var seriesData = []

export default class Merchanstati extends React.Component {
  //获取所有数据
  async getAllData() {
    let data = await getmerchanlist()
    data.forEach(item => {
      legendData.push(item.merchanname)
      seriesData.push({
        name: item.merchanname,
        value: item.cost,
      })
    })

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('merchanstati'))

    myChart.setOption({
      title: {
        text: '商户经营餐饮分析以及人均消费占比',
        left: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 120,
        top: 20,
        bottom: 20,
        data: legendData,

        // selected: legendData.selected
      },
      series: [
        {
          name: '姓名',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
  }

  componentDidMount() {
    legendData = []
    seriesData = []
    this.getAllData()
  }

  render() {
    return <div id="merchanstati" style={{ width: '100%', height: '100%' }}></div>
  }
}
