import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Input, Pagination, Select, Spin, message, Modal } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import { debounce as _debounce } from 'lodash'
import SvgIcon from '@/components/SvgIcon' // svg component
// import HeaderSearch from '@/components/header-search/index.vue'
import SubtaskTemplate from '@src/components/task/SubtaskTemplate.js'
// import ExtractUrl from '@/views/taskInitiation/newTask/components/extractUrl.vue'
// import ExtractID from '@/views/taskInitiation/newTask/components/extractID.vue'
// import MoreTaskInfo from './moreTaskInfo.vue'
// import ModalFilterMcType from '@/views/taskInitiation/gkList/components/ModalFilterMcType.vue'

import { getObjectTypeList, getPreparedListAPI, delPreparedListAPI } from '@src/api/taskInitiation/newTask'
import { dicList } from '@src/api/dic.js'
import { getMediaList } from '@/utils/getMediaList'
import './GkList.scss'
const { Option } = Select
const { Search } = Input
const GkList = props => {
  let [query, setQuery] = useState({
    publishTime: [],
    createTime: [],
    mcObjectCodeList: [],
    productNameList: [],
    sourceTypeList: [],
    orderBy: 'createTime-DESC',
    keyword: '',
  })
  let [showLine, setShowLine] = useState(3)
  let [pageObj, setPageObj] = useState({
    number: 1,
    size: 10,
    total: 0,
  })
  let [indeterminate, setIndeterminate] = useState(false)
  let [checkAll, setCheckAll] = useState(false)
  let [checkedSubtaskIds, setCheckedSubtaskIds] = useState([])
  let [checkedSubtaskList, setCheckedSubtaskList] = useState([])
  let [subtaskList, setSubtaskList] = useState([])
  let finallyTaskList = [] // 最终下发的列表
  let [headerOptions, setHeaderOptions] = useState([])
  let [urlDrawerVisible, setUrlDrawerVisible] = useState(false)
  let [extractIDVisible, setExtractIDVisible] = useState(false)
  let [showMoreTaskInfo, setShowMoreTaskInfo] = useState(false)
  let [filterMcTypeVisible, setFilterMcTypeVisible] = useState(false)
  let [loading, setLoading] = useState(false)
  useEffect(() => {
    // setLoading(true)
    // getOption()
    getSubtaskList()
  }, [])

  // 获取管控对象列表
  const getMcObjList = () => {
    return new Promise((resolve, reject) => {
      getObjectTypeList({}).then(({ data }) => {
        const temp = data.filter(item => {
          return item.name !== 'MC_INTERACT' && item.name !== 'MC_KEYWORD'
        })
        const arr = JSON.parse(JSON.stringify(temp))
        resolve(arr)
      })
    })
  }
  // 获取产品分组列表
  const getProductGroupList = () => {
    return new Promise(resolve => {
      getMediaList().then(res => {
        resolve(res)
      })
    })
  }
  // 获取来源类型
  const getDicList = () => {
    return new Promise(resolve => {
      dicList({ dictType: ['sourceType'] }).then(res => {
        res.data.forEach(item => {
          if (item.dictType === 'sourceType') {
            resolve(item.dictContent)
          }
        })
      })
    })
  }
  const getOption = () => {
    Promise.all([getMcObjList(), getProductGroupList(), getDicList()]).then(data => {
      let mcObjectList = data[0]
      let productGroupList = data[1]
      mcObjectList = mcObjectList.map((item, index) => {
        return {
          label: item.desc,
          value: item.name,
        }
      })
      productGroupList = productGroupList.map(item => {
        return {
          label: item.desc,
          value: item.desc,
          children: item.children?.map(item2 => {
            return {
              showIcon: true,
              label: item2.desc,
              value: item2.desc,
              multipSelect: true, // 是否为多选
            }
          }),
        }
      })
      headerOptions = []
      headerOptions = [
        // #region
        {
          label: '创建时间',
          multipSelect: false,
          value: 'publishTime',
          type: 'date',
          children: [
            {
              label: '3小时', // 选项展示的字段
              value: '3', // 参数值
              type: 'hour', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
            {
              label: '12小时', // 选项展示的字段
              value: '12', // 参数值
              type: 'hour', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
            {
              label: '3天', // 选项展示的字段
              value: '3', // 参数值
              type: 'day', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
            {
              label: '自定义', // 选项展示的字段
              type: 'custom', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
          ],
        },
        {
          label: '加入列表时间',
          multipSelect: false,
          value: 'createTime',
          type: 'date',
          children: [
            {
              label: '3小时', // 选项展示的字段
              value: '3', // 参数值
              type: 'hour', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
            {
              label: '12小时', // 选项展示的字段
              value: '12', // 参数值
              type: 'hour', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
            {
              label: '3天', // 选项展示的字段
              value: '3', // 参数值
              type: 'day', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
            {
              label: '自定义', // 选项展示的字段
              type: 'custom', // 非必填，type的字段为'hour'| 'day'| 'custom',类型为custom的话会显现自定义时间
            },
          ],
        },
        // #endregion
        {
          label: '管控对象',
          multipSelect: false, // 是否为多选
          defalutAll: true,
          value: 'mcObjectCodeList', // 当前参数的字段名称
          children: [...mcObjectList],
        },
        {
          label: '产品分类',
          multipSelect: true, // 是否为多选
          value: 'productNameList', // 当前参数的字段名称
          children: [...productGroupList],
        },
      ]
      setHeaderOptions(headerOptions)
    })
  }
  // 筛选条件变化
  const headerChange = params => {
    setQuery({
      ...query,
      createTime: [params.createTime.startTime, params.createTime.endTime],
      publishTime: [params.publishTime.startTime, params.publishTime.endTime],
      productNameList: params.productNameList,
      mcObjectCodeList: params.mcObjectCodeList,
      sourceTypeList: params.sourceTypeList,
    })
    setPageObj({
      ...pageObj,
      number: 1,
    })
    getSubtaskList()
  }
  // 改变排序
  const changeDesc = () => {
    getSubtaskList()
  }
  // 改变分页
  const onPageChange = (page, pageSize) => {
    setPageObj({
      ...pageObj,
      number: page,
    })
    getSubtaskList()
  }
  // 改变每页条数
  const onShowSizeChange = (current, pageSize) => {
    setPageObj({
      ...pageObj,
      number: 1,
      size: pageSize,
    })
    getSubtaskList()
  }
  const setKeyword = _debounce(function () {
    setPageObj({
      ...pageObj,
      number: 1,
    })
    getSubtaskList()
  }, 500)
  // 获取待管控列表
  const getSubtaskList = () => {
    setLoading(true)
    getPreparedListAPI({
      joinEndTime: query.createTime && query.createTime[1],
      joinStartTime: query.createTime && query.createTime[0],
      publishEndTime: query.publishTime && query.publishTime[1],
      publishStartTime: query.publishTime && query.publishTime[0],
      fields: [query.orderBy.split('-') && query.orderBy.split('-')[0]],
      sortType: query.orderBy.split('-') && query.orderBy.split('-')[1],
      productNameList: query.productNameList,
      mcObjectCodeList: query.mcObjectCodeList,
      mcObjectCode: query.mcObjectCodeList[0],
      sourceTypeList: query.sourceTypeList,
      keyword: query.keyword,
      size: pageObj.size,
      number: pageObj.number - 1,
    })
      .then(({ data }) => {
        setSubtaskList(data.content)
        setPageObj({
          ...pageObj,
          number: data.number + 1,
          total: data.totalElements,
        })
        judgeCheckAll()
        setLoading(false)
        // 最后一页没有数据的情况
        if (data.totalElements && !data.content.length) {
          if (data.totalElements % data.size) {
            setPageObj({
              ...pageObj,
              number: parseInt(data.totalElements / data.size) + 1,
            })
          } else {
            setPageObj({
              ...pageObj,
              number: parseInt(data.totalElements / data.size),
            })
          }
          getSubtaskList()
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }
  // 全选
  const onCheckAllChange = e => {
    if (e.target.checked) {
      subtaskList.forEach(sub => {
        if (!checkedSubtaskIds.includes(sub.id)) {
          checkedSubtaskIds.push(sub.id)
          setCheckedSubtaskIds(checkedSubtaskIds)
          checkedSubtaskList.push(sub)
          setCheckedSubtaskList(checkedSubtaskList)
        }
      })
    } else {
      checkedSubtaskIds = checkedSubtaskIds.filter(id => {
        return !subtaskList.find(item => item.id === id)
      })
      setCheckedSubtaskIds(checkedSubtaskIds)
      checkedSubtaskList = checkedSubtaskList.filter(item => {
        return checkedSubtaskIds.includes(item.id)
      })
      setCheckedSubtaskList(checkedSubtaskList)
    }
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }
  // 勾选子任务
  const onCheckSubtask = item => {
    if (!checkedSubtaskIds.includes(item.id)) {
      checkedSubtaskIds.push(item.id)
      checkedSubtaskList.push(item)
      setCheckedSubtaskIds(checkedSubtaskIds)
      setCheckedSubtaskList(checkedSubtaskList)
    } else {
      checkedSubtaskIds.forEach((id, index) => {
        if (id === item.id) {
          checkedSubtaskIds.splice(index, 1)
        }
      })
      checkedSubtaskList.forEach((checkSub, index) => {
        if (checkSub.id === item.id) {
          checkedSubtaskList.splice(index, 1)
        }
      })
      setCheckedSubtaskIds(checkedSubtaskIds)
      setCheckedSubtaskList(checkedSubtaskList)
    }
    judgeCheckAll()
  }
  // 判断全选、半选状态
  const judgeCheckAll = () => {
    // 过滤后的可见数据中选中的长度
    let viewCheckedLength = 0
    if (checkedSubtaskIds.length) {
      viewCheckedLength = checkedSubtaskIds.filter(id => {
        return subtaskList.find(item => item.id === id)
      }).length
    }
    const allLength = subtaskList.length
    indeterminate = !!viewCheckedLength && viewCheckedLength < allLength
    setIndeterminate(indeterminate)
    checkAll = !!viewCheckedLength && viewCheckedLength === allLength
    setCheckAll(checkAll)
  }
  // 打开抽屉，提取URL
  const openUrlDrawer = () => {
    setUrlDrawerVisible(true)
  }
  // 打开抽屉，提取ID
  const openIDDrawer = () => {
    setExtractIDVisible(true)
  }
  const beforeBatchDispose = () => {
    if (!checkedSubtaskList.length) {
      message.warning('请先选择要下发的数据')
      return
    }
    // 判断是同一种管控对象吗
    const isSameMcObject = checkedSubtaskList.every(item => {
      return item.mcObjectCode === checkedSubtaskList[0].mcObjectCode
    })
    if (!isSameMcObject) {
      setFilterMcTypeVisible(true)
      return
    }
    batchDispose(checkedSubtaskList)
  }
  // 批量下发
  const batchDispose = handleOkList => {
    const notWhiteTaskList = handleOkList.filter(item => {
      return item.greyOrWhite !== 'WHITE'
    })
    if (notWhiteTaskList.length === 0 && handleOkList.length === 1) {
      message.error('白名单数据，禁止下发')
      return
    } else if (notWhiteTaskList.length === 0) {
      message.error('均为白名单数据，禁止下发')
      return
    } else if (notWhiteTaskList.length > 0 && notWhiteTaskList.length < handleOkList.length) {
      message.warning('含白名单数据，已自动过滤白名单数据')
    }
    const param = {
      mcObject: notWhiteTaskList[0].mcObjectIndex,
      preparedSubtaskList: notWhiteTaskList,
    }
    finallyTaskList = param.preparedSubtaskList.map(item => item.id)
    setShowMoreTaskInfo(true) // 不是账号类型
  }
  const disposeSuccess = () => {
    setCheckedSubtaskIds([])
    setCheckedSubtaskList([])
    getSubtaskList()
  }
  // 删除待管控列表
  const delSubtask = (id, type) => {
    let ids = []
    if (type === 'batch') {
      if (!checkedSubtaskIds.length) {
        message.warning('请先选择要移除的数据')
        return
      }
      ids = checkedSubtaskIds
    } else {
      ids = [id]
    }
    Modal.confirm({
      title: '提示',
      content: type === 'batch' ? '您确定要移除选中的数据吗？' : '您确定要移除吗？',
      onOk() {
        delPreparedListAPI(ids).then(() => {
          getSubtaskList()
          if (type === 'batch') {
            setCheckedSubtaskIds([])
            setCheckedSubtaskList([])
          }
          message.success('移除成功')
        })
      },
    })
  }
  const fnReset = () => {
    query = {
      keyword: '',
      publishTime: [],
      createTime: [],
      mcObjectCodeList: [],
      productNameList: [],
      sourceTypeList: [],
      orderBy: 'createTime-DESC',
    }
    setQuery(query)
    setCheckedSubtaskIds([])
    setCheckedSubtaskList([])
    getOption()
    getSubtaskList()
  }
  const fnShowMore = () => {
    if (showLine === 3) {
      setShowLine(999)
    } else {
      setShowLine(3)
    }
  }

  return (
    <div className="GkList">
      <div className="top-query">
        {/* <HeaderSearch options={headerOptions} show-line={showLine}" onChange={headerChange} /> */}
        <div className="top-query-btn flex-end">
          <Button className="base-btn" onClick={fnReset}>
            <SvgIcon iconClass="icon-reset" className="mr6" />
            重置
          </Button>
          <Button type="link" onClick={fnShowMore}>
            {showLine > 3 ? '收起' : '展开'}
            {showLine > 3 ? <UpOutlined /> : <DownOutlined />}
          </Button>
        </div>
      </div>
      <div className="container">
        <div className="subtask-header flex-center-v flex-between">
          <div className="subtask-header-left flex-center-v">
            <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={onCheckAllChange}>
              全选（{checkedSubtaskIds.length}条）
            </Checkbox>
            <Select value={query.orderBy} style={{ width: '150px', marginLeft: '20px' }} onChange={changeDesc}>
              <Option value="publishTime-ASC"> 创建时间升序 </Option>
              <Option value="publishTime-DESC"> 创建时间倒序 </Option>
              <Option value="createTime-ASC"> 加入列表时间升序 </Option>
              <Option value="createTime-DESC"> 加入列表时间倒序 </Option>
            </Select>
          </div>
          <div className="subtask-header-right flex-center-v">
            <Search
              value={query.keyword}
              placeholder="多个关键词用空格隔开"
              allowClear
              style={{ width: '200px' }}
              onChange={setKeyword}
              onSearch={setKeyword}
            />
            {props.match.params.authBtn?.includes('iddaoru') && (
              <Button className="action-btn" onClick={openIDDrawer}>
                <SvgIcon iconClass="icon-import-id" className="mr6" />
                ID导入
              </Button>
            )}
            {props.match.params.authBtn?.includes('urldaoru') && (
              <Button className="action-btn" onClick={openUrlDrawer}>
                <SvgIcon iconClass="icon-import-url" className="mr6" />
                url导入
              </Button>
            )}
            {props.match.params.authBtn?.includes('piliangxiafa') && (
              <Button className="action-btn" onClick={beforeBatchDispose}>
                <SvgIcon iconClass="icon-dispose" style={{ color: '#1b62ec' }} className="mr6" />
                下发
              </Button>
            )}
            {props.match.params.authBtn?.includes('piliangshanchu') && (
              <Button className="action-btn" onClick={() => delSubtask('', 'batch')}>
                <SvgIcon iconClass="yichu" style={{ color: '#1b62ec' }} className="mr6" />
                移除
              </Button>
            )}
          </div>
        </div>
        <div className="subtask-container">
          {subtaskList.length ? (
            <div>
              {subtaskList.map(subtask => {
                return (
                  <div key={subtask.id} className="subtask flex-center-v">
                    <Checkbox
                      checked={checkedSubtaskIds.includes(subtask.id)}
                      onChange={() => onCheckSubtask(subtask)}
                    ></Checkbox>
                    <SubtaskTemplate tag qrcode info={subtask}>
                      <span slot="afterBtn">
                        {props.match.params.authBtn?.includes('piliangxiafa') && subtask.greyOrWhite !== 'WHITE' && (
                          <SvgIcon
                            iconClass="icon-dispose"
                            style={{ marginLeft: '18px' }}
                            title="下发"
                            onClick={() => batchDispose([subtask])}
                          />
                        )}
                        <SvgIcon
                          iconClass="yichu"
                          style={{ marginLeft: '18px' }}
                          title="移除"
                          onClick={() => delSubtask(subtask.id)}
                        />
                      </span>
                    </SubtaskTemplate>
                  </div>
                )
              })}
            </div>
          ) : (
            <py-empty />
          )}
        </div>
        <div className="subtask-footer flex-between flex-center-v">
          <span>共{pageObj.total}条</span>
          <Pagination
            total={pageObj.total}
            current={pageObj.number}
            pageSize={pageObj.size}
            showSizeChanger
            showQuickJumper
            onChange={onPageChange}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
      </div>
      {/* <ExtractUrl v-model="urlDrawerVisible" onHandleOk={fnReset} />
      <ExtractID v-model="extractIDVisible" onHandleOk={fnReset} />
      <ModalFilterMcType v-model="filterMcTypeVisible" subtask-list="checkedSubtaskList" onHandleOk={batchDispose} />
      <MoreTaskInfo v-model="showMoreTaskInfo" task-id-list="finallyTaskList" onSuccess={disposeSuccess} /> */}
      {loading && (
        <div className="spin-wrap">
          <Spin />
        </div>
      )}
    </div>
  )
}
export default withRouter(GkList)
