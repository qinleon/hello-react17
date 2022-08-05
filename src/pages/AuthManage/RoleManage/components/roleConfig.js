import React, { useState } from 'react'
import { Button, Table, Drawer, Checkbox, Popover, message } from 'antd'
import { getMcObjectListAPI, saveRoleAuthAPI, getMcObjectListByRoleIdAPI } from '@src/api/auth/roleManage'
import { getExecGopPage } from '@src/api/auth/productClassification'
import './roleConfig.scss'
import _ from 'lodash'
const CheckboxGroup = Checkbox.Group
const RoleConfig = props => {
  const { role } = props
  const [activeBadge, setActiveBadge] = useState('')
  const [loading, setLoading] = useState([])
  const [saveLoading, setSaveLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  let tempTableData = []
  let productTypeList = []

  const [arr, setArr] = useState([{ name: '123' }])
  const changeArr = item => {
    item.name = 456
    console.log(arr)
    setArr([...arr])
  }
  const afterVisibleChange = visible => {
    if (visible) {
      getProductTypeList(role)
    }
  }
  // 获取产品分组列表
  const getProductTypeList = role => {
    setLoading(true)
    getExecGopPage({ number: 0, size: 9999 }).then(({ data }) => {
      productTypeList = data.content.filter(item => {
        return item.list.length
      })
      getMcObjectList(role)
    })
  }
  // 获取管控对象全数据
  const getMcObjectList = role => {
    getMcObjectListAPI().then(({ data }) => {
      tempTableData = []
      data.forEach(item => {
        item.children.forEach(dataType => {
          tempTableData.push({
            desc: item.desc,
            index: item.index,
            mcName: item.name,
            mcPname: item.pname,
            ...dataType,
            productObj: {
              indeterminate: false,
              checkAll: false,
              selectCheckBoxList: [],
              productTypeList: productTypeList || [],
            },
          })
        })
      })
      getMcObjectListByRoleId(role)
    })
  }
  const getMcObjectListByRoleId = role => {
    getMcObjectListByRoleIdAPI({ roleId: role.id, number: 0, size: 9999 }).then(({ data }) => {
      setLoading(false)
      tempTableData.forEach(tableItem => {
        data.forEach(newItem => {
          if (tableItem.allCode === newItem.allCode && tableItem.mcName === newItem.mcObjectCode) {
            tableItem.productObj.selectCheckBoxList.push(newItem.groupId)
          }
        })
      })
      tempTableData.forEach(tableItem => {
        if (tableItem.productObj.selectCheckBoxList.length === tableItem.productObj.productTypeList.length) {
          tableItem.productObj.checkAll = true
        } else if (tableItem.productObj.selectCheckBoxList.length > 0) {
          tableItem.productObj.indeterminate = true
        }
      })
      setTableData(tempTableData)
    })
  }
  const onChange = (checkedList, item, record, e) => {
    let indeterminate = !!checkedList.length && checkedList.length < item.productTypeList.length
    let checkAll = checkedList.length === item.productTypeList.length
    setTableData(
      tableData.map(row =>
        row.id === record.id
          ? { ...row, productObj: { ...row.productObj, indeterminate, checkAll, selectCheckBoxList: checkedList } }
          : row
      )
    )
  }
  const onCheckAllChange = (item, record, e) => {
    setTableData(
      tableData.map(row => {
        if (row.id === record.id) {
          return {
            ...row,
            productObj: {
              ...row.productObj,
              selectCheckBoxList: e.target.checked ? item.productTypeList.map(group => group.id) : [],
              indeterminate: false,
              checkAll: e.target.checked,
            },
          }
        } else {
          return row
        }
      })
    )
  }
  const visibleChange = (visible, value, allCode) => {
    setActiveBadge(visible ? value + allCode : '')
  }
  const saveAuth = () => {
    const arr = []
    tableData.forEach(item => {
      item.productObj.selectCheckBoxList.forEach(groupId => {
        arr.push({
          roleId: role.id,
          mcObjectCode: item.mcName,
          allCode: item.allCode,
          groupId: groupId,
        })
      })
    })
    setSaveLoading(true)
    saveRoleAuthAPI({
      roleId: role.id,
      list: arr,
    })
      .then(() => {
        message.success('操作成功！')
        onClose()
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }
  const onClose = () => {
    props.onClose()
    let temp = _.cloneDeep(tableData)
    temp.forEach(tableItem => {
      tableItem.productObj.selectCheckBoxList = []
      tableItem.productObj.checkAll = false
      tableItem.productObj.indeterminate = false
    })
    setTableData(temp)
  }
  const columnsData = [
    {
      title: '管控对象',
      dataIndex: 'desc',
      key: 'desc',
      onCell: (row, index) => {
        let rowSpan
        let length = tableData.filter(item => item.desc === row.desc).length
        if (index === tableData.findIndex(item => item.desc === row.desc)) {
          rowSpan = length
        } else {
          rowSpan = 0
        }
        return {
          rowSpan: rowSpan,
        }
      },
      render: value => <span>{value}</span>,
    },
    {
      title: '操作类型',
      dataIndex: 'name',
      render: value => <span>{value}</span>,
    },
    {
      title: '产品分类',
      colSpan: 2,
      dataIndex: 'productObj',
      render: (text, record, index) => {
        return (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <Checkbox
                indeterminate={text.indeterminate}
                checked={text.checkAll}
                onChange={e => {
                  onCheckAllChange(text, record, e)
                }}
              >
                全部
              </Checkbox>
            </div>
            <CheckboxGroup
              value={text.selectCheckBoxList}
              className="ant-checkbox-group"
              onChange={(value, e) => {
                onChange(value, text, record, e)
              }}
            >
              {text.productTypeList.map(item => {
                return (
                  <span key={item.id}>
                    <span title={item.name} style={{ verticalAlign: 'middle' }}>
                      <Checkbox value={item.id}> {item.name} </Checkbox>
                    </span>
                    {item.list && item.list.length ? (
                      <Popover
                        placement="bottom"
                        overlayClassName="my-el-popover"
                        visibleChange={e => {
                          visibleChange(e, item.id, record.allCode)
                        }}
                        getPopupContainer={triggerNode => triggerNode}
                        content={item.list.map(i => {
                          return (
                            <span key={i.id} style={{ margin: '10px' }}>
                              <svg-icon icon-class={i.productNameEn} style={{ marginRight: '2px' }} />
                              <span>{i.productName}</span>
                            </span>
                          )
                        })}
                      >
                        <span className={['badge', activeBadge === item.id + record.allCode ? 'active' : '']}>
                          {item.list.length}
                        </span>
                      </Popover>
                    ) : (
                      <span className={['badge', activeBadge === item.id + record.allCode ? 'active' : '']}>
                        {item.list && item.list.length}
                      </span>
                    )}
                  </span>
                )
              })}
            </CheckboxGroup>
          </div>
        )
      },
    },
  ]
  return (
    <>
      <Drawer
        title="配置权限"
        width={1200}
        visible={props.visible}
        afterVisibleChange={afterVisibleChange}
        bodyStyle={{ paddingBottom: '80px' }}
        className="permissions-web"
        onClose={onClose}
      >
        <div className="permissions-div">
          <span style={{ color: '#666' }}>角色名称</span>
          <span style={{ marginLeft: '24px', color: '#333' }}>{role.name}</span>
        </div>
        <div className="permissions-div">
          <span style={{ color: '#666' }}>角色描述</span>
          <span style={{ marginLeft: '24px', color: '#333' }}>暂无描述</span>
        </div>
        <Table
          rowKey={record => {
            return record.mcName + record.allCode
          }}
          loading={loading}
          columns={columnsData}
          dataSource={tableData}
          bordered
          pagination={false}
        ></Table>
        <div onClick={() => changeArr(arr[0])}>{arr.map(item => item.name)}</div>
        <div className="drawer-footer">
          <Button style={{ marginRight: '8px' }} onClick={onClose}>
            取消
          </Button>
          <Button type="primary" loading={saveLoading} onClick={saveAuth}>
            确定
          </Button>
        </div>
      </Drawer>
    </>
  )
}
export default RoleConfig
