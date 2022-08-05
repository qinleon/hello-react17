import React, { useEffect, useState } from 'react'
import useSyncCallback from '@src/hooks/useSyncCallback.js'
import { Button, Table, Input, DatePicker, Pagination, message, Modal, Col, Row, Form } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import _ from 'lodash'

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

const UserDictionary = () => {
  const [newQuery, setNewQuery] = useState({
    dictName: undefined,
    dictType: undefined,
    createdBy: undefined,
    startTime: '',
    endTime: '',
  })
  let oldQuery = {}
  let newQueryBackup = {}
  let labelColModal = { span: 4 }
  let wrapperColModal = { span: 20 }
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
  let copyModalForm = {}
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [selectedRowKeysDetail, setSelectedRowKeysDetail] = useState([])
  const [selectedRowDetail, setSelectedRowDetail] = useState([])
  const [expandedRowKeys, setExpandedRowKeys] = useState([]) // 展开的行
  const [bindRoleDrawer, setBindRoleDrawer] = useState({
    visible: false,
    dictionary: {},
  }) // 绑定角色的抽屉
  copyModalForm = _.cloneDeep(modalForm)
  newQueryBackup = _.cloneDeep(newQuery)
  useEffect(() => {
    // fn_getDictionaryList()
  }, [])
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
    setNewQuery(_.cloneDeep(newQueryBackup))
    oldQuery = _.cloneDeep(newQueryBackup)
    fn_getDictionaryList()
  }
  // 分页方法
  const handleChangeCurrent = num => {
    setFilterObj({
      ...filterObj,
      number: num,
    })
    setSelectedRowKeysDetail([])
    setSelectedRowDetail([])
    fn_getDictionaryList()
  }
  // 改变每页条数
  const onShowSizeChange = (num, size) => {
    setFilterObj({
      ...filterObj,
      size: size,
    })
    setSelectedRowKeysDetail([])
    setSelectedRowDetail([])
    fn_getDictionaryList()
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
  // 打开弹框
  const openModal = val => {
    if (val) {
      setModalTitle('编辑字典')
      setModalForm(_.cloneDeep(val))
    } else {
      setModalTitle('新增字典')
    }
    setModalVisible(true)
  }
  // 新增字典或者修改
  const addDictionary = async () => {
    try {
      const values = await modalForm.validateFields()
      console.log('Success:', values)
      if (values) {
        setConfirmLoading(true)
        saveDictionary({ ...this.modalForm, dictCategory: this.dictCategory })
          .then(res => {
            message.success('操作成功')
            setConfirmLoading(false)
            setModalVisible(false)
            this.fn_getDictionaryList()
            this.expandedRowsChange()
            // this.$store.dispatch('dic/getDictList')
          })
          .catch(() => {
            setConfirmLoading(false)
          })
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  // 关闭弹框
  const closeModal = () => {
    setModalVisible(false)
    setModalForm(_.cloneDeep(copyModalForm))
    this.$refs.modalForm.clearValidate()
  }
  // 添加子项
  const parentAdd = () => {
    if (modalForm.dictContent) {
      setModalForm({
        ...modalForm,
        dictContent: [
          ...modalForm.dictContent,
          {
            dictName: undefined,
            dictType: undefined,
          },
        ],
      })
    } else {
      setModalForm({
        ...modalForm,
        dictContent: [
          {
            dictName: undefined,
            dictType: undefined,
          },
        ],
      })
    }
  }
  // 删除子项
  const delItemBtn = (subDict, index) => {
    const that = this
    confirm({
      title: '提示',
      content: '您确定要删除吗？',
      onOk() {
        if (subDict.id) {
          deleteSubDictAPI(that.modalForm.id, subDict.id).then(({ data }) => {
            that.$message.success('操作成功！')
            that.fn_getDictionaryList()
            that.modalForm.dictContent.splice(index, 1)
            that.expandedRowsChange()
            that.$store.dispatch('dic/getDictList')
          })
        } else {
          that.modalForm.dictContent.splice(index, 1)
          that.$message.success('操作成功！')
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
    if (keys) {
      setExpandedRowKeys(keys.slice(-1))
    }
    if (expandedRowKeys.length) {
      setSubTableLoading(true)
      getSubDictListByDictAPI(expandedRowKeys[0])
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
  const onSelectChangeDetail = (selectedRowKeys, row) => {
    setSelectedRowDetail(selectedRowKeys)
    if (row.length === 0) {
      setSelectedRowDetail([])
    } else {
      const result = row.map(v => {
        return v.id
      })
      setSelectedRowDetail(result)
    }
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
    if (val || selectedRowDetail.length > 0) {
      var that = this
      confirm({
        title: '提示',
        content: text,
        onOk() {
          var deleteIds = []
          if (val) {
            deleteIds = [item.id]
          } else {
            deleteIds = that.selectedRowDetail
          }
          return new Promise((resolve, reject) => {
            delDictionaryAPI({ deleteIds })
              .then(res => {
                that.$message.success('删除成功！')
                that.fn_getDictionaryList()
                if (!val) {
                  that.selectedRowKeysDetail = []
                  that.selectedRowDetail = []
                }
                resolve()
              })
              .catch(() => {
                that.$message.success('删除失败！')
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
            <a-divider v-if="isAdmin" type="vertical" />
            <template v-if="dictCategory === 'USER' && isAdmin">
              <Button type="link" size="small" onClick={() => openBindRoleDrawer(record)}>
                配置
              </Button>
              <a-divider type="vertical" />
            </template>
            <Button
              v-if="isAdmin"
              type="link"
              size="small"
              onClick={() => fn_delete(true, '您确定要删除当前字典信息吗？', record)}
            >
              删除
            </Button>
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
  let dictCategory = () => {
    return this.$route.path === '/systemManagement/userDictionary' ? 'USER' : 'SYSTEM'
  }
  let isAdmin = () => {
    return this.$route.meta.authBtn?.includes('adminBtn')
  }
  return (
    <div className="UserDictionary">
      {/* <div className="query-bar flex-between">
        <div className="query-left flex-center-v flex-wrap">
          <div className="query-item flex-center-v">
            <div className="label">字典名称：</div>
            <Input v-model="newQuery.dictName" placeholder="请输入字典名称" allow-clear style={{ width: '200px' }} />
          </div>
          <div className="query-item flex-center-v">
            <div className="label">创建人：</div>
            <Input v-model="newQuery.createdBy" placeholder="请输入创建人" allow-clear style={{ width: '200px' }} />
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
            <Button className="base-btn" onClick={openModal()}>
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
          rowKey="item => item.id"
          dataSource={tableData}
          columns={tableHead}
          loading={loading}
          pagination={false}
          expandIconAsCell={false}
          expandIconColumnIndex={1}
          rowSelection={{ selectedRowKeys: selectedRowKeysDetail, onChange: onSelectChangeDetail }}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={expandedRowsChange}
          expandable={{
            expandedRowRender: record => (
              <Table
                className="subTable"
                size="small"
                row-key="item => item.id"
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
              page-size={filterObj.size}
              page-size-options={filterObj.pageSizeOptions}
              show-size-changer
              onChange={handleChangeCurrent}
              onShowSizeChange={onShowSizeChange}
            />
          </div>
        ) : null}
        <Modal
          visible={modalVisible}
          title={modalTitle}
          afterClose={closeModal}
          confirmLoading={confirmLoading}
          mask-closable={false}
          className="addModal"
          width="700px"
          onOk={addDictionary}
        >
          <Form form={modalForm} rules={rules} labelCol={labelColModal} wrapperCol={wrapperColModal}>
            <Form.Item label="字典名称" prop="dictName" style={{ paddingLeft: '5px' }}>
              <Input v-if="isAdmin" v-model="modalForm.dictName" placeholder="最多输入50字" />
              <span v-else>{modalForm.dictName}</span>
            </Form.Item>
            <Form.Item label="字典编码" prop="dictType" style={{ paddingLeft: '5px' }}>
              <Input v-if="isAdmin" v-model="modalForm.dictType" placeholder="最多输入50字" />
              <span v-else>{modalForm.dictType}</span>
            </Form.Item>
            <div className="addTitle">
              <p>子项列表</p>
            </div>
            {modalForm.dictContent.map((item, index) => (
              <div key={index} className="parentItem">
                <Row type="flex">
                  <Col span="11">
                    <Form.Item
                      label="名称"
                      label-col="{ span: 7 }"
                      wrapper-col="{ span: 17 }"
                      prop="'dictContent.' + index + '.dictName'"
                      rules={[
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { validator: strLenValid(50), trigger: 'blur' },
                        { validator: validSpace(), trigger: 'blur' },
                      ]}
                    >
                      <Input v-model="item.dictName" placeholder="最多输入50字" />
                    </Form.Item>
                  </Col>
                  <Col span="11">
                    <Form.Item
                      label="编码"
                      label-col="{ span: 7 }"
                      wrapper-col="{ span: 17 }"
                      prop="'dictContent.' + index + '.dictType'"
                      rules={[
                        { required: true, message: '请输入编码', trigger: 'blur' },
                        { validator: strLenValid(50), trigger: 'blur' },
                        { validator: validSpace(), trigger: 'blur' },
                      ]}
                    >
                      <Input v-model="item.dictType" placeholder="最多输入50字" />
                    </Form.Item>
                  </Col>
                  <Col span="2">
                    <Button type="link" onClick={() => delItemBtn(item, index)}>
                      <svg-icon icon-className="icon-delete" className="mission-query-svg" />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            <div className="addSubDictBtn flex-center" onClick={parentAdd}>
              添加子项
            </div>
          </Form>
        </Modal>
      </div> */}
    </div>
  )
}
export default UserDictionary
