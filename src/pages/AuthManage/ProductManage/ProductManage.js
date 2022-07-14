/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-06-01 16:03:10
 * @LastEditors: Qleo
 * @LastEditTime: 2022-07-14 14:41:52
 */
import React from 'react'
import './ProductManage.scss'
import { getProductListAPI, getProductGroupListAPI } from '../../../api/auth/productClassAPI.js'
import _debounce from 'lodash.debounce'

import { Button, Modal, Checkbox } from 'antd'
import AddProductGroupModal from './AddProductGroupModal.js'

export default class ProductManageClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groupList: [],
      activeGroup: {},
      productList: [
        {
          id: 21,
          updateTime: '2022-05-27 16:40:25',
          createTime: '2022-03-19 13:13:06',
          deleteFlag: 'NO',
          enterpriseCode: 'd5aa7cd2316987a6',
          companyName: '微博',
          productCode: 'd2f2ba3fd3199387',
          productName: '新浪微博',
          productNameEn: 'xinlangweibo',
          offline: 'NO',
          blockFlag: 0,
          greyFlag: 0,
          matchUrl: 'weibo.com',
          sortNo: 1
        },
        {
          id: 93,
          updateTime: '2022-05-27 17:18:57',
          createTime: '2022-05-19 17:51:58',
          deleteFlag: 'NO',
          enterpriseCode: '5bca57432136ee47',
          companyName: '苹果公司',
          productCode: 'b82b4d09ad79f8f6',
          productName: 'dw',
          productNameEn: 'dd',
          offline: 'NO',
          blockFlag: 0,
          greyFlag: 0,
          matchUrl: null,
          sortNo: 1
        },
        {
          id: 113,
          updateTime: '2022-06-07 10:15:32',
          createTime: '2022-06-07 10:15:32',
          deleteFlag: 'NO',
          enterpriseCode: 'd5aa7cd2316987a6',
          companyName: '微博',
          productCode: 'd5e7e76f30d0bbd3',
          productName: 'AAAA1',
          productNameEn: 'aaaa',
          offline: 'NO',
          blockFlag: 0,
          greyFlag: 0,
          matchUrl: null,
          sortNo: 100004
        },
        {
          id: 114,
          updateTime: '2022-06-07 12:00:02',
          createTime: '2022-06-07 12:00:02',
          deleteFlag: 'NO',
          enterpriseCode: 'cdc9dc265dd61586',
          companyName: '新浪',
          productCode: '38be597a802bda4a',
          productName: '新闻',
          productNameEn: 'piny',
          offline: 'NO',
          blockFlag: 0,
          greyFlag: 0,
          matchUrl: null,
          sortNo: 100004
        }
      ],
      filterProductCodeList: [],
      checkedProductCodes: [],
      indeterminate: false,
      checkAll: false,
      isEdited: false,
      keywords: '',
      modalVisible: false
    }
  }
  componentDidMount() {
    this.getProductList()
    this.getProductGroupList()
  }
  // 获取分组
  getProductGroupList = () => {
    getProductGroupListAPI({ number: 0, size: 99999 }).then(({ data }) => {
      this.setState({
        groupList: data.content
      })
    })
  }
  // 左侧点击分组
  clickGroup = item => {
    const that = this
    const nextFn = () => {
      that.setState({
        activeGroup: item,
        checkedProductCodes: item.list.map(item => item.productCode),
        isEdited: false,
        keywords: ''
      })
      that.searchProductCodeList()
    }
    if (this.state.isEdited && this.state.activeGroup.id !== item.id) {
      const { confirm } = Modal
      confirm({
        title: '上次的修改还未保存，放弃修改并跳转吗?',
        onOk: nextFn
      })
    } else {
      nextFn()
    }
  }

  // 获取产品列表
  getProductList = () => {
    getProductListAPI().then(({ data }) => {
      this.setState({
        productList: data,
        filterProductCodeList: data.map(item => item.productCode)
      })
    })
  }
  // 全选
  onCheckAllChange = e => {
    let checkedList = []
    if (e.target.checked) {
      checkedList = [...new Set(this.state.checkedProductCodes.concat(this.state.filterProductCodeList))]
    } else {
      checkedList = this.state.checkedProductCodes.filter(item => {
        return !this.state.filterProductCodeList.includes(item)
      })
    }
    this.setState({
      checkedProductCodes: checkedList,
      indeterminate: false,
      checkAll: e.target.checked
    })
  }
  // 右侧公司点击
  clickProduct = item => {
    this.setState({
      isEdited: true
    })
    if (!this.state.checkedProductCodes.includes(item.productCode)) {
      this.setState({
        checkedProductCodes: [...this.state.checkedProductCodes, item.productCode]
      })
    } else {
      this.state.checkedProductCodes.forEach((i, index) => {
        if (i === item.productCode) {
          this.state.checkedProductCodes.splice(index, 1)
          this.setState({
            checkedProductCodes: this.state.checkedProductCodes
          })
        }
      })
    }
    this.judgeCheckAll()
  }
  // 模糊搜索产品
  searchProductCodeList = _debounce(() => {
    const value = this.keywords
    this.setState({
      filterProductCodeList: this.state.productList
        .filter(item => {
          return item.productName.includes(value)
        })
        .map(item => item.productCode)
    })
    this.judgeCheckAll()
  }, 500)
  // 判断全选、半选状态
  judgeCheckAll = () => {
    // 过滤后的可见数据中选中的长度
    let viewCheckedLength = 0
    if (this.state.checkedProductCodes.length) {
      viewCheckedLength = this.state.checkedProductCodes.filter(code => {
        return this.state.filterProductCodeList.includes(code)
      }).length
    }
    this.setState({
      indeterminate: !!viewCheckedLength && viewCheckedLength < this.state.filterProductCodeList.length,
      checkAll: !!viewCheckedLength && viewCheckedLength === this.state.filterProductCodeList.length
    })
  }
  showModal = () => {
    this.setState({
      modalVisible: true
    })
  }
  render() {
    return (
      <div className="productManage flex">
        <div className="left-group product-left">
          <Button type="primary" onClick={this.showModal}>
            添加
          </Button>
          <div className="group-list">
            {this.state.groupList.map(item => {
              return (
                <div
                  className={`group-item ${this.state.activeGroup.id === item.id ? 'active' : ''}`}
                  onClick={() => {
                    this.clickGroup(item)
                  }}
                  key={item.id}
                >
                  {item.name}
                </div>
              )
            })}
          </div>
        </div>
        <div className="right-product product-right flex-1">
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
          <div className="product-checkbox-group" value={this.state.checkedList}>
            {this.state.productList.map(item => {
              if (item.productName !== '') {
                return (
                  <div className="product" key={item.productCode}>
                    <Checkbox
                      value={item.productCode}
                      checked={this.state.checkedProductCodes.includes(item.productCode)}
                      onClick={() => {
                        this.clickProduct(item)
                      }}
                    >
                      {item.productName}
                    </Checkbox>
                  </div>
                )
              } else {
                return ''
              }
            })}
          </div>
        </div>
        <AddProductGroupModal visible={this.state.modalVisible}></AddProductGroupModal>
      </div>
    )
  }
}
