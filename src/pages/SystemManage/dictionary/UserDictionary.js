import React, { useEffect, useState, useRef } from 'react'
import useSyncCallback from '@src/hooks/useSyncCallback.js'
import { Button, Table, Input, DatePicker, Pagination, message, Modal, Divider, Form, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import _ from 'lodash'
import './UserDictionary.scss'
import { withRouter } from 'react-router-dom'

import {
  getDictionaryList,
  saveDictionary,
  delDictionary as delDictionaryAPI,
  deleteSubDictAPI,
  getSubDictListByDictAPI,
} from '@src/api/dictionary/index.js'
// import SubDictBindRole from './components/SubDictBindRole.js'
import moment from 'moment'
import { strLenValid, validSpace } from '@src/utils/validate.js'
const { confirm } = Modal
const { RangePicker } = DatePicker

const UserDictionary = props => {
  const [newQuery, setNewQuery] = useState({
    dictName: undefined,
    dictType: undefined,
    createdBy: undefined,
    startTime: '',
    endTime: '',
  })
  let oldQuery = {}
  let labelColModal = { flex: '100px' }
  let wrapperColModal = { flex: 1 }
  const [tableData, setTableData] = useState([])
  const [subTableData, setSubTableData] = useState([])
  const [subTableLoading, setSubTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterObj, setFilterObj] = useState({
    sortType: 'DESC',
    number: 1,
    size: 10,
    total: 0,
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增字典')
  const [modalForm, setModalForm] = useState({
    dictName: undefined,
    dictType: undefined,
    dictContent: [],
  })
  const [modalFormRef] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [expandedRowKeys, setExpandedRowKeys] = useState([]) // 展开的行
  const [bindRoleDrawer, setBindRoleDrawer] = useState({
    visible: false,
    dictionary: {},
  }) // 绑定角色的抽屉

  let dictCategory = props.history.location.pathname === '/layouts/systemManage/userDictionary' ? 'USER' : 'SYSTEM'
  let isAdmin = true || props.history.location.meta?.authBtn?.includes('adminBtn')

  let copyModalForm = useRef({})
  let newQueryBackup = useRef({})

  useEffect(() => {
    copyModalForm.current = _.cloneDeep(modalForm)
    newQueryBackup.current = _.cloneDeep(newQuery)
    fn_getDictionaryList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeNewQuery = (e, key) => {
    console.log(key)
    setNewQuery({
      ...newQuery,
      [key]: e.target.value,
    })
  }
  //   搜索
  const fn_search = () => {
    setFilterObj({
      ...filterObj,
      number: 1,
    })
    oldQuery = _.cloneDeep(newQuery)
    fn_getDictionaryList()
  }
  const fn_reset = () => {
    setFilterObj({
      ...filterObj,
      number: 1,
    })
    console.log(newQueryBackup)
    setNewQuery(_.cloneDeep(newQueryBackup.current))
    oldQuery = _.cloneDeep(newQueryBackup.current)
    fn_getDictionaryList()
  }
  // 分页方法  // 改变每页条数
  const onShowSizeChange = (num, size) => {
    setFilterObj({
      ...filterObj,
      number: num,
      size: size || filterObj.size,
    })
    setSelectedRowKeys([])
    syncGetDictionaryList()
  }
  // 获取列表数据
  const fn_getDictionaryList = () => {
    setLoading(true)
    var form = {
      ...oldQuery,
      dictCategory: dictCategory,
      number: filterObj.number - 1,
      size: filterObj.size,
    }
    getDictionaryList(form)
      .then(({ data }) => {
        setLoading(false)
        setTableData(data.content || [])
        setFilterObj({
          ...filterObj,
          total: data.totalElements || 0,
        })
        if (filterObj.number !== 1 && data.content.length === 0) {
          filterObj.number -= 1
          setFilterObj({
            ...filterObj,
            number: filterObj.number - 1,
          })
          fn_getDictionaryList()
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const syncGetDictionaryList = useSyncCallback(fn_getDictionaryList)
  // 打开弹框
  const openModal = val => {
    if (val) {
      console.log(val)
      setModalTitle('编辑字典')
      setModalForm(val)
      modalFormRef.setFieldsValue({
        ...val,
      })
    } else {
      setModalTitle('新增字典')
    }
    setModalVisible(true)
  }
  // 新增字典或者修改
  const addDictionary = async () => {
    try {
      const values = await modalFormRef.validateFields()
      console.log(values)
      setConfirmLoading(true)
      saveDictionary({ id: modalForm.id, ...values, dictCategory: dictCategory })
        .then(res => {
          message.success('操作成功')
          setConfirmLoading(false)
          fn_getDictionaryList()
          expandedRowsChange()
          closeModal()
          // this.$store.dispatch('dic/getDictList')
        })
        .catch(() => {
          setConfirmLoading(false)
        })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  // 关闭弹框
  const closeModal = () => {
    setModalVisible(false)
    setModalForm(_.cloneDeep(copyModalForm))
    modalFormRef.resetFields()
  }
  // 删除子项
  const delItemBtn = (index, callback) => {
    console.log(index)
    confirm({
      title: '提示',
      content: '您确定要删除吗？',
      onOk() {
        if (modalForm.dictContent[index]?.id) {
          deleteSubDictAPI(modalForm.id, modalForm.dictContent[index].id).then(({ data }) => {
            message.success('操作成功！')
            fn_getDictionaryList()
            modalForm.dictContent.splice(index, 1)
            callback()
            expandedRowsChange()
            // $store.dispatch('dic/getDictList')
          })
        } else {
          modalForm.dictContent.splice(index, 1)
          callback()
          message.success('操作成功！')
        }
      },
    })
  }
  // 日期控件的默认值设置方法
  const momentTime = (time, format) => {
    return moment(time, format)
  }
  // 日期控件的change方法
  const fn_timeChange = (data, dateString) => {
    setNewQuery({
      ...newQuery,
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }
  // 展开表格
  const expandedRowsChange = keys => {
    let newKeys = []
    if (keys) {
      newKeys = keys.slice(-1)
      setExpandedRowKeys(newKeys)
    }
    if (newKeys.length) {
      setSubTableLoading(true)
      getSubDictListByDictAPI(newKeys[0])
        .then(({ data }) => {
          setSubTableData(
            data.map(item => {
              return {
                id: item.id,
                dictName: item.dictName,
                roleNameList: item.roleList.map(item => item.name).join('、'),
              }
            })
          )
          setSubTableLoading(false)
        })
        .catch(() => {
          setSubTableLoading(false)
        })
    } else {
      setSubTableData([])
    }
  }
  // 表格的多项选择
  const onSelectChange = (selectedRowKeys, row) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  // 打开绑定角色的抽屉
  const openBindRoleDrawer = dict => {
    setBindRoleDrawer({
      visible: true,
      dictionary: dict,
    })
  }
  // 批量删除
  const fn_delete = (val, text, item) => {
    if (val || selectedRowKeys.length > 0) {
      confirm({
        title: '提示',
        content: text,
        onOk() {
          var deleteIds = []
          if (val) {
            deleteIds = [item.id]
          } else {
            deleteIds = selectedRowKeys
          }
          return new Promise((resolve, reject) => {
            delDictionaryAPI({ deleteIds })
              .then(res => {
                message.success('删除成功！')
                fn_getDictionaryList()
                if (!val) {
                  setSelectedRowKeys([])
                }
                resolve()
              })
              .catch(() => {
                message.success('删除失败！')
                reject()
              })
          })
        },
      })
    } else {
      message.warning('请先选择要删除的字典信息！')
    }
  }

  let tableHead = [
    // #region
    {
      title: '序号',
      dataIndex: 'index',
      width: 100,
      render: (text, record, index) => `${index + 1}`,
    },
    Table.EXPAND_COLUMN,
    {
      title: '字典名称',
      dataIndex: 'dictName',
      render: text => {
        return text || '-'
      },
    },
    {
      title: '字典编码',
      dataIndex: 'dictType',
      render: text => {
        return text || '-'
      },
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      render: text => {
        return text || '-'
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: text => {
        return text || '-'
      },
    },
    {
      title: '最后修改人',
      dataIndex: 'updatedBy',
      render: text => {
        return text || '-'
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      render: text => {
        return text || '-'
      },
    },
    {
      title: '操作',
      scopedSlots: { render: 'action' },
      align: 'center',
      render: (text, record, index) => {
        return (
          <div slot="action" slot-scope="record">
            <Button type="link" size="small" onClick={() => openModal(record)}>
              编辑
            </Button>
            {isAdmin ? (
              <>
                <Divider type="vertical" />
                {dictCategory === 'USER' ? (
                  <>
                    <Button type="link" size="small" onClick={() => openBindRoleDrawer(record)}>
                      配置
                    </Button>
                    <Divider type="vertical" />
                  </>
                ) : null}
                <Button
                  type="link"
                  size="small"
                  onClick={() => fn_delete(true, '您确定要删除当前字典信息吗？', record)}
                >
                  删除
                </Button>
              </>
            ) : null}
          </div>
        )
      },
    },
    // #endregion
  ]
  let subTableHead = [
    {
      title: '子项名称',
      dataIndex: 'dictName',
      width: 200,
      render: text => {
        return text || '-'
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleNameList',
      render: text => {
        return text || '-'
      },
    },
  ]
  let rules = {
    dictName: [
      { required: true, message: '请输入字典名称', trigger: 'blur' },
      { validator: strLenValid(50), trigger: 'blur' },
      { validator: validSpace(), trigger: 'blur' },
    ],
    dictType: [
      { required: true, message: '请输入字典编码', trigger: 'blur' },
      { validator: strLenValid(50), trigger: 'blur' },
      { validator: validSpace(), trigger: 'blur' },
    ],
  }

  return (
    <div className="UserDictionary">
      <div className="query-bar flex-between">
        <div className="query-left flex-center-v flex-wrap">
          <div className="query-item flex-center-v">
            <div className="label">字典名称：</div>
            <Input
              value={newQuery.dictName}
              placeholder="请输入字典名称"
              allowClear={true}
              style={{ width: '200px' }}
              onChange={e => changeNewQuery(e, 'dictName')}
            />
          </div>
          <div className="query-item flex-center-v">
            <div className="label">创建人：</div>
            <Input
              value={newQuery.createdBy}
              placeholder="请输入创建人"
              allowClear={true}
              style={{ width: '200px' }}
              onChange={e => changeNewQuery(e, 'createdBy')}
            />
          </div>
          <div className="query-item flex-center-v">
            <div className="label">创建时间：</div>
            <RangePicker
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              showTime={{ defaultValue: [momentTime('00:00:00', 'HH:mm:ss'), momentTime('23:59:59', 'HH:mm:ss')] }}
              onChange={fn_timeChange}
            ></RangePicker>
          </div>
        </div>
        <div className="query-right">
          <Button className="base-btn" onClick={fn_search}>
            <SearchOutlined />
            搜索
          </Button>
          <Button className="base-btn" onClick={fn_reset}>
            <ReloadOutlined />
            重置
          </Button>
        </div>
      </div>
      <div className="container">
        <div className="flex-between">
          <div className="base-title">字典列表</div>
          <div v-if="isAdmin">
            <Button className="base-btn" onClick={() => openModal()}>
              <svg-icon icon-className="add" className="mission-query-svg" />
              新建
            </Button>
            <Button className="base-btn" onClick={() => fn_delete(false, '您确定要删除当前选中的字典信息吗？')}>
              <svg-icon icon-className="icon-delete" className="mission-query-svg" />
              删除
            </Button>
          </div>
        </div>
        <Table
          className="mainTable"
          rowKey={item => item.id}
          dataSource={tableData}
          columns={tableHead}
          loading={loading}
          pagination={false}
          expandIconAsCell={false}
          rowSelection={{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={expandedRowsChange}
          expandable={{
            expandedRowRender: record => (
              <Table
                className="subTable"
                size="small"
                rowKey={item => item.id}
                columns={subTableHead}
                dataSource={subTableData}
                loading={subTableLoading}
                locale={{ emptyText: '暂无数据' }}
                pagination={false}
              ></Table>
            ),
            rowExpandable: record => record.name !== 'Not Expandable',
          }}
        ></Table>
        {tableData.length ? (
          <div className="tablePage">
            <span>共{filterObj.total}条</span>
            <Pagination
              total={filterObj.total}
              current={filterObj.number}
              pageSize={filterObj.size}
              showSizeChanger
              onChange={onShowSizeChange}
              onShowSizeChange={onShowSizeChange}
            />
          </div>
        ) : null}
        <Modal
          visible={modalVisible}
          title={modalTitle}
          afterClose={closeModal}
          confirmLoading={confirmLoading}
          maskClosable={false}
          className="addModal"
          width="700px"
          onOk={addDictionary}
          onCancel={closeModal}
        >
          <Form form={modalFormRef} labelCol={labelColModal} wrapperCol={wrapperColModal} name="fddaf">
            <Form.Item label="字典名称" name="dictName" rules={[{ required: true, message: '请输入字典名称' }]}>
              <Input placeholder="最多输入50字" />
            </Form.Item>
            <Form.Item label="字典编码" required>
              {isAdmin ? (
                <Form.Item name="dictType" rules={[{ required: true, message: '请输入字典编码' }]}>
                  <Input placeholder="最多输入50字" />
                </Form.Item>
              ) : (
                <span>{modalForm.dictType}</span>
              )}
            </Form.Item>
            <div className="addTitle">
              <p>子项列表</p>
            </div>
            <Form.List name="dictContent">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        label="字典名称"
                        name={[name, 'dictName']}
                        className="flex-1"
                        style={{ flexWrap: 'nowrap' }}
                        rules={[{ required: true, message: '请输入字典名称' }]}
                      >
                        <Input placeholder="最多输入50字" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="字典编码"
                        name={[name, 'dictType']}
                        className="flex-1"
                        rules={[{ required: true, message: '请输入字典编码' }]}
                      >
                        <Input placeholder="最多输入50字" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => delItemBtn(key, () => remove(name))} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加子项
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
export default withRouter(UserDictionary)
