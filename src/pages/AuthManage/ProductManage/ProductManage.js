/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-06-01 16:03:10
 * @LastEditors: Qleo
 * @LastEditTime: 2022-08-11 11:24:40
 */
import React from 'react'
import './ProductManage.scss'
import {
  getProductListAPI,
  getProductGroupListAPI,
  beforeCheckDeleteProductGroupAPI,
  deleteProductGroupAPI,
  saveGroupProductInfoAPI,
} from '../../../api/auth/productClassAPI.js'
import _ from 'lodash'

import AddProductGroupModal from './AddProductGroupModal.js'
import { Button, Modal, Checkbox, message, Input } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
const { Search } = Input
export default class ProductManageClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groupList: [],
      activeGroup: {},
      productList: [],
      filterProductCodeList: [],
      checkedProductCodes: [],
      indeterminate: false,
      checkAll: false,
      isEdited: false,
      keywords: '',
      addModal: {
        visible: false,
        actionType: 'add', //or 'edit'
      },
      addModalForm: {},
    }
  }
  componentDidMount() {
    this.getProductList()
    this.getGroupList()
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return
    }
  }
  // 获取分组
  getGroupList = () => {
    getProductGroupListAPI({ number: 0, size: 99999 }).then(({ data }) => {
      this.setState({
        groupList: data.content,
      })
      let isAdd = false
      if (data.content.length > this.state.groupList.length) {
        isAdd = true
      }
      // 如果新增分组，则激活第一个，否则激活上次的
      if (this.state.activeGroup.id && !isAdd) {
        let newActiveGroup = this.state.groupList.find(item => item.id === this.state.activeGroup.id)
        this.setState({
          activeGroup: newActiveGroup || data.content[0],
        })
      } else {
        this.setState({
          activeGroup: data.content[0],
        })
      }
      this.setState({
        checkedProductCodes: [],
      })
      this.state.productList.forEach(j => {
        this.state.activeGroup.list.forEach(i => {
          if (i.productCode === j.productCode) {
            this.setState({
              checkedProductCodes: [...this.state.checkedProductCodes, i.productCode],
            })
          }
        })
      })
      this.judgeCheckAll()
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
        keywords: '',
      })
      that.searchProductCodeList()
    }
    if (this.state.isEdited && this.state.activeGroup.id !== item.id) {
      confirm({
        title: '上次的修改还未保存，放弃修改并跳转吗?',
        onOk: nextFn,
      })
    } else {
      nextFn()
    }
  }

  // 获取产品列表
  getProductList = () => {
    getProductListAPI().then(({ data }) => {
      console.log(this)
      this.setState({
        productList: data,
        filterProductCodeList: data.map(item => item.productCode),
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
      checkAll: e.target.checked,
    })
  }
  // 右侧公司点击
  clickProduct = item => {
    this.setState({
      isEdited: true,
    })
    if (!this.state.checkedProductCodes.includes(item.productCode)) {
      this.setState(
        () => ({
          checkedProductCodes: [...this.state.checkedProductCodes, item.productCode],
        }),
        () => {
          this.judgeCheckAll()
        }
      )
    } else {
      this.state.checkedProductCodes.forEach((i, index) => {
        if (i === item.productCode) {
          this.state.checkedProductCodes.splice(index, 1)
          this.setState(
            {
              checkedProductCodes: this.state.checkedProductCodes,
            },
            () => {
              this.judgeCheckAll()
            }
          )
        }
      })
    }
  }
  // 模糊搜索产品
  searchProductCodeList = _.debounce((value = '') => {
    this.setState({
      keywords: value,
      filterProductCodeList: this.state.productList
        .filter(item => {
          return item.productName.includes(value)
        })
        .map(item => item.productCode),
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
      checkAll: !!viewCheckedLength && viewCheckedLength === this.state.filterProductCodeList.length,
    })
  }
  openAddModal = (item, e) => {
    e?.stopPropagation()
    e?.nativeEvent.stopImmediatePropagation()
    if (item) {
      this.setState({
        addModal: { ...this.state.addModal, visible: true },
        addModalForm: item,
      })
    } else {
      this.setState({
        addModal: { ...this.state.addModal, visible: true },
        addModalForm: {},
      })
    }
  }
  closeAddModal = () => {
    this.setState({
      addModal: { ...this.state.addModal, visible: false },
      addModalForm: {},
    })
  }
  // 删除
  deleteGroup = group => {
    let that = this
    confirm({
      title: '确定删除吗',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return new Promise((resolve, reject) => {
          beforeCheckDeleteProductGroupAPI([group.id]).then(({ data }) => {
            if (data.length) {
              confirm({
                title: '提示',
                content: '当前分类有角色占用，您确定要删除此分类吗？',
                onOk() {
                  return new Promise(resolve2 => {
                    deleteProductGroupAPI([group.id]).then(({ data }) => {
                      message.success('操作成功！')
                      that.getGroupList()
                      resolve2()
                    })
                  })
                },
              })
            } else {
              deleteProductGroupAPI([group.id]).then(({ data }) => {
                message.success('操作成功！')
                that.getGroupList()
                resolve()
              })
            }
          })
        })
      },
    })
  }
  // 保存分组和产品信息 确定
  saveGroupProductInfo = () => {
    this.setState({
      loadStatus: true,
    })
    saveGroupProductInfoAPI({
      groupId: this.state.activeGroup.id,
      productCodes: this.state.checkedProductCodes,
    })
      .then(res => {
        this.setState({
          loadStatus: false,
          isEdited: false,
        })
        message.success('保存成功！')
        this.getGroupList()
      })
      .finally(() => {
        this.setState({
          loadStatus: false,
        })
      })
  }

  render() {
    return (
      <div className="productManage flex">
        <div className="left-group product-left">
          <Button type="primary" onClick={this.openAddModal}>
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
                  <div className="group-name flex-1">{item.name}</div>
                  <div>
                    <Button
                      type="link"
                      size="small"
                      onClick={e => {
                        this.openAddModal(item, e)
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        this.deleteGroup(item)
                      }}
                    >
                      删除
                    </Button>
                  </div>
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
            全选
          </Checkbox>
          <Search
            allowClear
            placeholder="请输入产品名称"
            onInput={e => {
              this.searchProductCodeList(e.target.value)
            }}
            onSearch={this.searchProductCodeList}
            style={{ width: 200 }}
          />
          <div className="product-checkbox-group" value={this.state.checkedList}>
            {this.state.productList.map(item => {
              if (item.productName !== '' && this.state.filterProductCodeList.includes(item.productCode)) {
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
          <Button onClick={this.saveGroupProductInfo}>确定</Button>
        </div>
        <AddProductGroupModal
          visible={this.state.addModal.visible}
          formData={this.state.addModalForm}
          onCancel={this.closeAddModal}
          onSuccess={this.getGroupList}
        ></AddProductGroupModal>
      </div>
    )
  }
}
