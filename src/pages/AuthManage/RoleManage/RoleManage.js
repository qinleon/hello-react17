import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import './RoleManage.scss'
// import RoleConfig from './components/roleConfig.vue'
// import RoleDetail from './components/roleDetail.vue'
import { getRoleListAPI, updateRoleStatusAPI } from '@src/api/auth/roleManage'
const { Column } = Table

const RoleManage = props => {
  const [newQuery, setNewQuery] = useState({
    roleCode: '',
    roleName: '',
  })
  const [oldQuery, setOldQuery] = useState({
    roleCode: '',
    roleName: '',
  })
  const [tableData, setTableData] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [curRole, setCurRole] = useState({})

  useEffect(() => {
    getRoleList()
  }, [])
  // 搜索
  const onSearch = () => {
    setPagination({ ...pagination, current: 1 })
    setOldQuery({ ...oldQuery, ...newQuery })
    console.log(oldQuery)
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
  const handleTableChange = pagination => {
    setPagination({ ...pagination, current: pagination.current })
    getRoleList()
  }
  // 改变角色状态
  const changeRoleStatus = (record, value) => {
    record.loading = true
    updateRoleStatusAPI({
      stopIds: [record.id],
      statusFlag: value ? 'NO' : 'YES',
    }).then(({ data }) => {
      getRoleList()
      record.loading = false
    })
  }
  // 配置权限
  const getPermissions = record => {
    setCurRole(record)
    this.$refs.permissions.visible = true
    this.$refs.permissions.getProductTypeList(record)
  }
  const getSee = record => {
    setCurRole(record)
    this.$refs.rolesee.visibleSee = true
    this.$refs.rolesee.getUserListByRole(record)
    this.$refs.rolesee.getProductTypeList(record)
  }

  return (
    <>
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
            <Input value={newQuery.roleCode} className="mission-query-search" placeholder="请输入角色编码" allowClear />
            <Button className="query-btn" icon={<SearchOutlined />} onClick={onSearch}>
              搜索
            </Button>
          </div>
        </div>
        <Table rowKey={record => record.id} dataSource={tableData} pagination={pagination} onChange={handleTableChange}>
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
      </div>
    </>
  )
}
export default RoleManage
