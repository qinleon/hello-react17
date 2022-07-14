/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-06-01 16:03:10
 * @LastEditors: Qleo
 * @LastEditTime: 2022-06-01 18:55:39
 */
import React from 'react'
import { Button } from 'antd'
export default class RoleManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      productList: [{ name: 'ada' }],
    }
  }

  render() {
    return (
      <div>
        <div className="left-group">
          <Button>添加</Button>&emsp;
          <div className="product-group" />
        </div>
        <div className="right-product">
          {this.state.productList.map(item => {
            return <div className="product">{item.name}</div>
          })}
        </div>
      </div>
    )
  }
}
