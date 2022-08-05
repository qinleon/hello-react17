import React, { useEffect, useState } from 'react'
import useSyncCallback from '@src/hooks/useSyncCallback.js'
import { Button, Table, Tag, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import './RoleManage.scss'
import _ from 'lodash'
import RoleConfig from './components/roleConfig.js'
import RoleDetail from './components/roleDetail.js'
import { getRoleListAPI } from '@src/api/auth/roleManage'
const { Column } = Table

const RoleManage = props => {
  const [newQuery, setNewQuery] = useState({
    roleCode: '',
    roleName: '',
  })
  let oldQuery = {}
  const [tableData, setTableData] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [curRole, setCurRole] = useState({})
  const [roleConfigVisible, setRoleConfigVisible] = useState(false)
  const [roleDetailVisible, setRoleDetailVisible] = useState(false)
  useEffect(() => {
    getRoleList()
  }, [])

  // 搜索
  const onSearch = () => {
    setPagination({ ...pagination, current: 1 })
    oldQuery = _.cloneDeep(newQuery)
    getRoleList()
  }
  // 获取角色列表
  const getRoleList = () => {
    getRoleListAPI({
      number: pagination.current - 1,
      size: pagination.pageSize,
      roleCode: oldQuery.roleCode,
      roleName: oldQuery.roleName,
    }).then(({ data }) => {
      data.content.forEach(item => {
        item.stopFlag = item.stopFlag === 'NO'
        item.loading = false
      })
      setTableData(data.content)
      setPagination({ ...pagination, total: data.totalElements, current: data.number + 1 })
    })
  }
  const handleTableChange = newPagination => {
    setPagination({ ...newPagination })
    syncGetRoleList()
  }
  const syncGetRoleList = useSyncCallback(getRoleList)
  // 配置权限
  const getPermissions = record => {
    setCurRole(record)
    setRoleConfigVisible(true)
  }
  const roleConfigOnClose = () => {
    setRoleConfigVisible(false)
  }
  const getSee = record => {
    setCurRole(record)
    setRoleDetailVisible(true)
  }
  const roleDetailOnClose = () => {
    setRoleDetailVisible(false)
  }

  return (
    <div className="roleManage">
      <div className="newTaskHeader">
        <span className="newTaskSpan">角色管理</span>
      </div>
      <div className="department-head">
        <div className="department-head-left flex-center-v">
          角色名称：
          <Input
            value={newQuery.roleName}
            onChange={e => setNewQuery({ ...newQuery, roleName: e.target.value })}
            className="mission-query-search"
            placeholder="请输入角色名称"
            allowClear
          />
          角色编码：
          <Input
            value={newQuery.roleCode}
            onChange={e => setNewQuery({ ...newQuery, roleCode: e.target.value })}
            className="mission-query-search"
            placeholder="请输入角色编码"
            allowClear
          />
          <Button className="query-btn" icon={<SearchOutlined />} onClick={onSearch}>
            搜索
          </Button>
        </div>
      </div>
      <Table
        rowKey={record => record.id}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        dataSource={tableData}
        onChange={handleTableChange}
      >
        <Column title="序号" dataIndex="index" key="index" render={(text, record, index) => <>{index + 1}</>} />
        <Column title="角色名称" dataIndex="name" key="name" render={text => <>{text || '-'}</>} />
        <Column title="角色编码" dataIndex="code" key="code" render={text => <>{text || '-'}</>} />
        <Column title="创建时间" dataIndex="createTime" key="createTime" render={text => <>{text || '-'}</>} />
        <Column
          title="状态"
          dataIndex="stopFlag"
          key="stopFlag"
          render={(text, record, index) => (
            <Tag color={record.stopFlag ? 'green' : 'red'}>{record.stopFlag ? '启用' : '停用'}</Tag>
          )}
        />
        <Column
          title="操作"
          dataIndex="operation"
          key="operation"
          render={(text, record, index) => (
            <>
              <Button className="tableBtn" onClick={() => getSee(record)}>
                查看
              </Button>
              <Button className="tableBtn" onClick={() => getPermissions(record)}>
                配置权限
              </Button>
            </>
          )}
        />
      </Table>
      <RoleConfig role={curRole} visible={roleConfigVisible} onClose={roleConfigOnClose} />
      <RoleDetail role={curRole} visible={roleDetailVisible} onClose={roleDetailOnClose} />
    </div>
  )
}
export default RoleManage
