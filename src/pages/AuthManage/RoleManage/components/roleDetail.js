import { useState } from 'react'
import { getUserListByRoleAPI, getMcObjectListAPI, getMcObjectListByRoleIdAPI } from '@src/api/auth/roleManage'
import { getExecGopPage } from '@src/api/auth/productClassification'
import { Button, Table, Drawer, Popover } from 'antd'
import _ from 'lodash'

const ConfigDetail = props => {
  const [userTableData, setUserTableData] = useState([])
  const [openStatus, setOpenStatus] = useState(true)
  const [roleStatus, setRoleStatus] = useState('')
  const [mcTableData, setMcTableData] = useState([])
  const { role } = props
  let productTypeList = [] // 产品类型分组列表
  let tempTableData = []
  let rawMcTableData = [] // 原始数据备份
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '用户账号',
      dataIndex: 'account',
      key: 'account',
      align: 'center',
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      align: 'center',
    },
  ]

  const afterVisibleChange = () => {
    getUserListByRole()
    getProductTypeList()
  }
  // 获取用户列表
  const getUserListByRole = () => {
    getUserListByRoleAPI({
      roleId: role.id,
    }).then(({ data }) => {
      setUserTableData(data)
    })
  }
  // 获取产品分组列表
  const getProductTypeList = () => {
    getExecGopPage({ number: 0, size: 9999 }).then(({ data }) => {
      productTypeList = data.content
      getMcObjectList()
    })
  }
  const getMcObjectList = () => {
    getMcObjectListAPI().then(({ data }) => {
      const arr = []
      data.forEach(item => {
        item.children.forEach(dataType => {
          arr.push({
            desc: item.desc,
            index: item.index,
            mcName: item.name,
            mcPname: item.pname,
            ...dataType,
            productList: [],
          })
        })
      })
      rawMcTableData = _.cloneDeep(arr)
      tempTableData = _.cloneDeep(arr)
      getMcObjectListByRoleId(role)
    })
  }
  const getMcObjectListByRoleId = role => {
    getMcObjectListByRoleIdAPI({ roleId: role.id, number: 0, size: 9999 }).then(({ data }) => {
      // 已选中的权限列表和产品列表对应起来
      data.forEach(item => {
        productTypeList.forEach(group => {
          if (item.groupId === group.id) {
            item.productList = group.list || []
          }
        })
      })
      // 全部管控对象和已选中的权限列表对应起来
      tempTableData.forEach(tableItem => {
        data.forEach(item => {
          if (item.allCode === tableItem.allCode) {
            tableItem.productList = tableItem.productList.concat(item.productList || [])
          }
        })
      })

      // 全部管控对象的产品列表去重
      tempTableData.forEach(tableItem => {
        const map = new Map()
        tableItem.productList = tableItem.productList.filter(item => {
          return !map.has(item.productCode) && map.set(item.productCode, 1)
        })
      })
      setMcTableData(tempTableData)
    })
  }
  const onClose = () => {
    setUserTableData([])
    if (rawMcTableData.length) {
      setMcTableData(JSON.parse(JSON.stringify(rawMcTableData)))
    }
    props.onClose()
  }
  const getOpen = () => {
    setOpenStatus(!openStatus)
  }
  const visibleChange = (visible, value) => {
    if (visible) {
      setRoleStatus(value)
    } else {
      setRoleStatus('')
    }
  }
  const columns2 = [
    {
      title: '管控对象',
      dataIndex: 'desc',
      key: 'desc',
      onCell: (row, index) => {
        let rowSpan
        let length = mcTableData.filter(item => item.desc === row.desc).length
        if (index === mcTableData.findIndex(item => item.desc === row.desc)) {
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
      key: 'name',
      width: 150,
      render: value => <span>{value}</span>,
    },
    {
      title: '产品',
      colSpan: 2,
      dataIndex: 'productList',
      key: 'productList',
      render: (text, record, index) => {
        return (
          <div className="flex-between">
            <div className="product-wrap">
              {text.slice(0, 8).map(i => {
                return (
                  <span key={i.id} style={{ margin: '10px' }} className="flex-between-span">
                    <svg-icon iconClass={i.productNameEn} style={{ marginRight: '2px' }} />
                    <span>{i.productName}</span>
                  </span>
                )
              })}
            </div>
            <Popover
              placement="bottom"
              overlayClassName="my-role-popover"
              visibleChange={visible => {
                visibleChange(visible, record.key)
              }}
              content={text.slice(8).map(i => {
                return (
                  <span key={i.id} style={{ margin: '10px' }}>
                    <svg-icon iconClass={i.productNameEn} style={{ marginRight: '2px' }} />
                    <span>{i.productName}</span>
                  </span>
                )
              })}
            >
              {text.slice(8).length ? (
                <span className={['badge', roleStatus === record.key ? 'active' : '']}>+{text.slice(8).length}</span>
              ) : null}
            </Popover>
          </div>
        )
      },
    },
  ]
  return (
    <Drawer
      title="查看"
      width={1200}
      visible={props.visible}
      bodyStyle={{ paddingBottom: '80px' }}
      afterVisibleChange={afterVisibleChange}
      className="role-see-web"
      onClose={onClose}
    >
      <div className="role-see-header">
        <div className="newTaskHeader">
          <span className="newTaskSpan">用户名（{userTableData.length}）</span>
          <span className="expandBtn" onClick={getOpen}>
            {openStatus ? '收起' : '展开'}
          </span>
        </div>
        {openStatus ? (
          <Table rowKey="id" columns={columns} dataSource={userTableData} size="middle" bordered pagination={false} />
        ) : null}
      </div>
      <div className="role-see-per">
        <div className="newTaskHeader">
          <span className="newTaskSpan">权限详情</span>
        </div>
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
          columns={columns2}
          dataSource={mcTableData}
          bordered
          pagination={false}
        ></Table>
      </div>
      <div className="drawer-footer">
        <Button style={{ marginRight: '8px' }} onClick={onClose}>
          关闭
        </Button>
      </div>
    </Drawer>
  )
}
export default ConfigDetail
