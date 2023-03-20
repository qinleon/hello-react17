import React, { useState, useEffect, useCallback } from 'react'
import './BigSearch.scss'
import { Select, Button, Input, Checkbox, Popover } from 'antd'
import { PlusSquareOutlined, MinusSquareOutlined, UpOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons'
import SvgIcon from '../../../components/SvgIcon'
import TimeSearch from '../../../components/timeSearch/TimeSearch'
import CheckboxSearch from '@/components/checkboxSearch/CheckboxSearch.jsx'
import PopoverSearch from '@src/components/popoverSearch/PopoverSearch'
import { getDic } from '@/api/integrateSearch'
import _ from 'lodash'
import useSyncCallback from '@src/hooks/useSyncCallback.js'
import moment from 'moment'
const { Option } = Select

let allProductMap = {} //产品列表接口返回的数据

export const Bigsearch = props => {
  const [expandStatus, setExpandStatus] = useState(true)
  const [relation, setRelation] = useState('AND')
  const [relationSearch, setRelationSearch] = useState([
    {
      id: Math.random(),
      searchType: 'all',
      searchWord: '',
    },
  ])
  const [dict, setDict] = useState({})
  const [curMenu, setCurMenu] = useState('MC_CONTENT')
  const [disposeStatusOptions, setDisposeStatusOptions] = useState([]) // 数据可见状态
  const [matchTypeOptions, setMatchTypeOptions] = useState([])
  const [pinyinTypeOptions, setPinyinTypeOptions] = useState([])
  const [languageTypeOptions, setLanguageTypeOptions] = useState([])
  const [regTypeOptions, setRegTypeOptions] = useState([])
  const [publishTime, setPublishTime] = useState({ type: '0', time: [] }) // 发布时间
  const [gkStateList, setGkStateList] = useState(['']) // 数据可见状态
  const [productList, setProductList] = useState([]) //产品列表
  const [productCheckAll, setProductCheckAll] = useState(true) // 不限产品选中状态
  const [checkedProductList, setCheckedProductList] = useState([]) //  选中的产品
  const [checkedProductIdList, setCheckedProductIdList] = useState([]) //  选中的产品id
  const [productListLen, setProductListLen] = useState(0)
  const [checkedResNum, setCheckedResNum] = useState(0) // 选中产品的结果数
  const [allResNum, setAllResNum] = useState(0) // 所有产品（不限）的结果数
  const [msgTypeList, setMsgTypeList] = useState(['']) // 匹配方式
  const [pinyinType, setPinyinType] = useState(['']) // 拓展
  const [regType, setRegType] = useState(['']) // 认证类型
  const [languageType, setLanguageType] = useState(['']) // 语言
  const [conditionList, setConditionList] = useState([]) // 已选条件
  const [allParams, setAllParams] = useState({}) // 发送emit的参数
  // 获取字典信息
  const fn_getDic = () => {
    return new Promise((resolve, reject) => {
      getDic({
        enumGroupList: ['gk_state', 'mix_MatchMode', 'mix_ExpandEnum', 'mix_LanguageEnum', 'mix_RegState'],
      }).then(({ data }) => {
        const infoData = data.infoData
        setDict(infoData)
        setDisposeStatusOptions([{ value: '', name: '全量', orderVal: '', children: [] }, ...infoData.gk_state])
        setMatchTypeOptions([{ value: '', name: '不限', orderVal: '', children: [] }, ...infoData.mix_MatchMode])
        setPinyinTypeOptions(infoData.mix_ExpandEnum)
        setLanguageTypeOptions(infoData.mix_LanguageEnum)
        resolve()
      })
    })
  }
  // 修改菜单后更新产品列表
  const getProductList = () => {
    try {
      const format = () => {
        const _allProductMap = _.cloneDeep(allProductMap)
        console.log(_allProductMap)
        let _productList = []
        if (curMenu === 'MC_GROUP') {
          _productList = _allProductMap.MediaType_q
        } else if (curMenu === 'MC_PLATES') {
          _productList = _allProductMap.MediaType_b
        } else if (curMenu === 'MC_LIVE_STREAM') {
          _productList = _allProductMap.MediaType_zhibo
        } else if (curMenu === 'MC_APPLICATION') {
          _productList = _allProductMap.MediaType.find(item => item.value === '905').children
        } else {
          _productList = _allProductMap.MediaType
        }
        _productList.forEach(item => {
          item.id = item.id || item.value
          item.number = 0
          item.children = item.children?.map(item2 => {
            return {
              id: item2.value,
              name: item2.name,
              number: 0,
              children: [],
            }
          })
        })
        console.log('_productList', _productList)
        setProductList(_productList)
        // 获取当前菜单下的产品总数
        setProductListLen(0)
        _productList.forEach(item => {
          if (item.children?.length) {
            setProductListLen(productListLen + item.children.length)
          } else {
            setProductListLen(productListLen + 1)
          }
        })
      }
      if (productList.length) {
        format()
        return
      }
      return new Promise((resolve, reject) => {
        getDic({
          enumGroupList: ['MediaType_zhibo', 'MediaType_q', 'MediaType_b', 'MediaType'],
        }).then(({ data }) => {
          allProductMap = data.infoData
          format()
          resolve(productList)
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fn_getDic()
    getProductList()
  }, [])
  useEffect(() => {
    console.log('allParams', allParams)
  }, [allParams])

  const onKeyWordsSearch = () => {}
  const addInputNum = () => {}
  const reduceInputNum = index => {}
  const expandToggle = () => {}
  const resetQuery = type => {
    setProductCheckAll(true)
    setCheckedProductList([])
    setCheckedProductIdList([])
    setPublishTime({ type: '0', time: [moment().startOf('day').format('x'), moment().format('x')] }) // 发布时间
    setGkStateList(['']) // 数据可见状态
    setMsgTypeList(['']) // 匹配方式
    setPinyinType(['']) // 拓展
    setLanguageType(['']) // 语言
    if (type !== 'changeMenu') {
      setRelationSearch([
        {
          id: Math.random(),
          searchType: 'all',
          searchWord: '',
        },
      ])
    }
    syncFormatCondition()
    props.change && props.change()
    props.reset && props.reset()
  }
  const saveQuery = () => {}
  const changeMenu = menu => {
    setCurMenu(menu)
    relationSearch.forEach(item => {
      item.searchType = 'all'
    })
    let max = 3
    if (curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM') {
      max = 4
    }
    if (relationSearch.length > max) {
      relationSearch.splice(max, relationSearch.length - max)
    }
    setRelationSearch(relationSearch)
  }
  useEffect(() => {
    getProductList()
    resetQuery('changeMenu')
  }, [curMenu])
  const publishTimeChange = (timeType, time) => {
    setPublishTime({ type: timeType, time: time })
    syncFormatCondition()
  }
  const checkboxSearchChange = (type, value) => {
    if (type === 'msgTypeList') {
      setMsgTypeList(value)
    } else if (type === 'pinyinType') {
      setPinyinType(value)
    } else if (type === 'regType') {
      setRegType(value)
    } else if (type === 'languageType') {
      setLanguageType(value)
    } else if (type === 'gkStateList') {
      setGkStateList(value)
    }
    syncFormatCondition()
  }

  // 清空产品列表
  const productCheckChange = e => {
    setProductCheckAll(true)
    setCheckedProductList([])
    setCheckedProductIdList([])
    syncFormatCondition()
  }
  // 数据通道改变
  const productListChange = checkedList => {
    console.log('产品列表change', checkedList)
    setCheckedProductList(checkedList)
    setCheckedProductIdList(checkedList.map(item => item.id))
    setProductCheckAll(!checkedList.length)
    syncFormatCondition()
  }
  // 删除某个条件中的一个值
  const delConditionValue = (condition, value) => {
    if (condition.value === 'gkStateList') {
      const arr = gkStateList.filter(item => item !== value)
      arr.length > 0 ? setGkStateList(arr) : setGkStateList([''])
    } else if (condition.value === 'msgTypeList') {
      const arr = msgTypeList.filter(item => item !== value)
      arr.length > 0 ? setMsgTypeList(arr) : setMsgTypeList([''])
    } else if (condition.value === 'pinyinType') {
      const arr = pinyinType.filter(item => item !== value)
      arr.length > 0 ? setPinyinType(arr) : setPinyinType([''])
    } else if (condition.value === 'regType') {
      const arr = regType.filter(item => item !== value)
      arr.length > 0 ? setRegType(arr) : setRegType([''])
    } else if (condition.value === 'languageType') {
      const arr = languageType.filter(item => item !== value)
      arr.length > 0 ? setLanguageType(arr) : setLanguageType([''])
    }
    if (condition.value === 'productList') {
      setCheckedProductList(checkedProductList.filter(item => item.id !== value))
      setCheckedProductIdList(checkedProductIdList.filter(item => item !== value))
      if (!checkedProductIdList.length) {
        setProductCheckAll(true)
      }
    }
    syncFormatCondition()
  }
  // 删除某个条件
  const delCondition = condition => {
    if (Array.isArray(condition.content)) {
      if (condition.value === 'productList') {
        setCheckedProductList([])
        setCheckedProductIdList([])
        setProductCheckAll(true)
      } else if (condition.value === 'gkStateList') {
        setGkStateList([''])
      } else if (condition.value === 'msgTypeList') {
        setMsgTypeList([''])
      } else if (condition.value === 'pinyinType') {
        setPinyinType([''])
      } else if (condition.value === 'regType') {
        setRegType([''])
      } else if (condition.value === 'languageType') {
        setLanguageType([''])
      }
    }
    syncFormatCondition()
  }
  const formatCondition = () => {
    try {
      setConditionList([
        {
          label: '发布时间',
          value: 'publishTime',
          content: '',
        },
        {
          label: '数据可见状态',
          value: 'gkStateList',
          content: disposeStatusOptions.filter(item => {
            return gkStateList.includes(item.value) && item.value !== ''
          }),
        },
        {
          label: '数据通道',
          value: 'productList',
          content: checkedProductList.map(item => {
            return {
              name: item.name,
              value: item.id,
            }
          }),
        },
        {
          label: '入库时间',
          value: 'insertTime',
          content: '',
        },
        {
          label: '匹配方式',
          value: 'msgTypeList',
          content: matchTypeOptions.filter(item => {
            return msgTypeList.includes(item.value) && item.value !== ''
          }),
        },
        {
          label: '拓展',
          value: 'pinyinType',
          content: pinyinTypeOptions.filter(item => {
            return pinyinType.includes(item.value) && item.value !== ''
          }),
        },
        {
          label: '认证类型',
          value: 'regType',
          content: regTypeOptions.filter(item => {
            return regType.includes(item.value) && item.value !== ''
          }),
        },
        {
          label: '语言',
          value: 'languageType',
          content: languageTypeOptions.filter(item => {
            return languageType.includes(item.value) && item.value !== ''
          }),
        },
      ])
    } catch (error) {
      console.log(error)
    }
    const _relationSearch = relationSearch.slice(0).map(item => {
      delete item.id
      return item
    })
    const allProductList = []
    productList.forEach(item => {
      if (item.children?.length) {
        item.children.forEach(item2 => {
          allProductList.push(item2)
        })
      } else {
        allProductList.push(item)
      }
    })
    setAllParams({
      relation: relation,
      relationSearch: _relationSearch,
      publishTime: curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM' ? publishTime : undefined, // 发布时间
      gkStateList:
        curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM' ? gkStateList.filter(item => item !== '') : [], // 数据可见状态   过滤有值的数据
      msgTypeList: curMenu === 'MC_CONTENT' ? msgTypeList.filter(item => item) : [], // 匹配方式
      pinyinType: pinyinType.filter(item => item), // 拓展
      languageType: languageType.filter(item => item), // 语言
      platformList: checkedProductList,
      allProductList: !checkedProductList.length ? allProductList : [],
      regTypeList: regType.filter(item => item), // 认证类型
      curMenu: curMenu,
    })
  }
  const syncFormatCondition = useSyncCallback(formatCondition)

  return (
    <div className="BigSearch">
      {/* <!-- ----------------------3个搜索框--------------------- --> */}
      <div className="keywordsSearch flex flex-center-v">
        {relationSearch.length > 1 && (
          <Select
            className="relationSelect"
            dropdown-class-name="relationSelect"
            value={relation}
            options={[
              { value: 'AND', label: '与' },
              { value: 'OR', label: '或' },
              { value: 'NOT', label: '非' },
            ]}
          />
        )}
        <div className="keywordsSearchRight flex-1">
          {relationSearch.map((item, index) => {
            return (
              <div className="keywordsSearchItem" key={item.id}>
                <Input.Group compact>
                  <Select
                    value={item.searchType}
                    defaultValue="Zhejiang"
                    className="keyWordsSelect"
                    popupclassname="keyWordsSelect"
                  >
                    <Option value="all">全部</Option>
                    <Option value="title">
                      {curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM' ? '标题' : ''}
                      {curMenu === 'MC_ACCOUNT' ? '账号' : ''}
                      {curMenu === 'MC_GROUP' ? '名称' : ''}
                      {curMenu === 'MC_PLATES' ? '名称' : ''}
                      {curMenu === 'MC_APPLICATION' ? '名称' : ''}
                    </Option>
                    <Option value="cont">
                      {curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM' ? '内容' : '简介'}
                    </Option>
                    {curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM' ? (
                      <Option v-if="" value="author_name">
                        账号
                      </Option>
                    ) : null}
                  </Select>
                  {index === 0 && (
                    <Input
                      value={item.searchWord}
                      placeholder="关键词之间支持英文运算符&（与）、|（或）、!（非）、()（优先级）组合运算"
                      style={{ color: '#333', width: 'calc(100% - 170px)' }}
                    ></Input>
                  )}
                  <Button
                    slot="enterButton"
                    style={{ background: '#066cfa', color: '#fff' }}
                    onClick={onKeyWordsSearch}
                  >
                    <SvgIcon iconClass="search" style={{ color: '#fff' }} />
                    搜索
                  </Button>
                </Input.Group>
                {index > 0 && (
                  <Input
                    value={item.searchWord}
                    placeholder="关键词之间支持英文运算符&（与）、|（或）、!（非）、()（优先级）组合运算"
                    style={{ color: '#333' }}
                  ></Input>
                )}
                {index === 0 && <PlusSquareOutlined onClick={addInputNum} />}
                {index > 0 && <MinusSquareOutlined onClick={() => reduceInputNum(index)} />}
              </div>
            )
          })}
        </div>
        <div className="threeBtn">
          <Button type="link" onClick={expandToggle}>
            {expandStatus ? '收起' : '展开'}高级搜索
            {expandStatus && <UpOutlined />}
            {!expandStatus && <DownOutlined />}
          </Button>
          <Button type="link" onClick={resetQuery}>
            重置搜索
          </Button>
          <Button v-show="haveKeyword()" type="link" onClick={saveQuery}>
            保存搜索
          </Button>
        </div>
      </div>
      {/* <!-- ----------------------6个大类--------------------- --> */}
      <div className="topMenu flex">
        <div className={`menu ${curMenu === 'MC_CONTENT' ? 'active' : ''}`} onClick={() => changeMenu('MC_CONTENT')}>
          <SvgIcon iconClass="monitor-content" /> 内容检索
        </div>
        <div className={`menu ${curMenu === 'MC_ACCOUNT' ? 'active' : ''}`} onClick={() => changeMenu('MC_ACCOUNT')}>
          <SvgIcon iconClass="monitor-account" /> 账号检索
        </div>
        <div className={`menu ${curMenu === 'MC_GROUP' ? 'active' : ''}`} onClick={() => changeMenu('MC_GROUP')}>
          <SvgIcon iconClass="monitor-group" /> 群组检索
        </div>
        <div
          className={`menu ${curMenu === 'MC_LIVE_STREAM' ? 'active' : ''}`}
          onClick={() => changeMenu('MC_LIVE_STREAM')}
        >
          <SvgIcon iconClass="monitor-live" /> 直播检索
        </div>
        <div className={`menu ${curMenu === 'MC_PLATES' ? 'active' : ''}`} onClick={() => changeMenu('MC_PLATES')}>
          <SvgIcon iconClass="monitor-plate" /> 版块检索
        </div>
        <div
          className={`menu ${curMenu === 'MC_APPLICATION' ? 'active' : ''}`}
          onClick={() => changeMenu('MC_APPLICATION')}
        >
          <SvgIcon iconClass="monitor-app" /> 应用检索
        </div>
      </div>
      {/* <!-- ----------------------筛选条件--------------------- --> */}
      <div className="row">
        {(curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM') && (
          <div
            className="row-item"
            style={{
              borderTop: '1px dashed #c3c3c3',
              width: curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM' ? '60%' : '100%',
            }}
          >
            <div className="label">发布时间：</div>
            <div className="row-content">
              <TimeSearch value={publishTime} onChange={publishTimeChange} />
            </div>
          </div>
        )}
        {(curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM') && (
          <div className="row-item right" style={{ borderTop: '1px dashed #c3c3c3' }}>
            <div className="label">数据可见状态：</div>
            <div className="row-content">
              <CheckboxSearch
                value={gkStateList}
                optionList={disposeStatusOptions}
                onChange={value => checkboxSearchChange('gkStateList', value)}
              />
            </div>
          </div>
        )}
        <div
          className="row-item productListWrap"
          style={{
            width: '100%',
            borderTop: curMenu === 'MC_CONTENT' || curMenu === 'MC_LIVE_STREAM' ? 'none' : '1px dashed #c3c3c3',
          }}
        >
          <div className="label">数据通道：</div>
          <div className="row-content flex-1">
            <Checkbox checked={productCheckAll} style={{ marginRight: '8px' }} onChange={productCheckChange}>
              <span>不限</span>
              {/* <!-- ({{ checkedProductIdList.length || productListLen }}/{{ productListLen }}) ({{ checkedResNum }}/{{
              allResNum
            }}) --> */}
            </Checkbox>
            <PopoverSearch
              productList={productList}
              checkedList={checkedProductIdList}
              style={{ margin: '3px 0' }}
              onChange={productListChange}
            />
          </div>
        </div>
        {expandStatus && curMenu === 'MC_CONTENT' && (
          <div className="row-item left">
            <div className="label">匹配方式：</div>
            <div className="row-content">
              <CheckboxSearch
                value={msgTypeList}
                optionList={matchTypeOptions}
                onChange={value => checkboxSearchChange('msgTypeList', value)}
              />
            </div>
          </div>
        )}
        {expandStatus && (
          <div className={`row-item ${curMenu === 'MC_CONTENT' ? 'right' : 'left'}`}>
            <div className="label">拓展：</div>
            <div className="row-content">
              <CheckboxSearch
                value={pinyinType}
                optionList={pinyinTypeOptions}
                onChange={value => checkboxSearchChange('pinyinType', value)}
              />
            </div>
          </div>
        )}
        {expandStatus && (
          <div className="row-item" style={{ width: curMenu === 'MC_CONTENT' ? '100%' : '40%' }}>
            <div className="label">语言：</div>
            <div className="row-content">
              <CheckboxSearch
                value={languageType}
                optionList={languageTypeOptions}
                onChange={value => checkboxSearchChange('languageType', value)}
              />
            </div>
          </div>
        )}
      </div>
      {/* <!-- ----------------------已选条件--------------------- --> */}
      <div className="conditionListWrap">
        {conditionList.some(condition => condition.content && condition.content.length) && (
          <div className="flex">
            <div style={{ lineHeight: '32px', fontWeight: '600', paddingLeft: '4px' }}>已选条件：</div>
            <div className="condition-list flex-1">
              {conditionList.map(condition => {
                return (
                  condition.content &&
                  condition.content.length > 0 && (
                    <div key={condition.value} className="condition">
                      {condition.label}：
                      {condition.content &&
                        condition.content.slice(0, 6).map(item2 => {
                          return (
                            Array.isArray(condition.content) && (
                              <div key={item2.value} className="condition-value">
                                {item2.name}
                                <CloseOutlined onClick={() => delConditionValue(condition, item2.value)} />
                              </div>
                            )
                          )
                        })}
                      {Array.isArray(condition.content) && condition.content.length > 6 && (
                        <Popover
                          placement="bottom"
                          get-popup-container={e => e.parentNode}
                          content={
                            condition.content &&
                            condition.content.slice(6).map(item2 => {
                              return (
                                Array.isArray(condition.content) && (
                                  <div key={item2.value} className="condition-value" style={{ margin: ' 4px 0' }}>
                                    {item2.name}
                                    <CloseOutlined onClick={() => delConditionValue(condition, item2.value)} />
                                  </div>
                                )
                              )
                            })
                          }
                        >
                          <div className="condition-value">
                            {'+' + (condition.content && condition.content.length - 6)}
                          </div>
                        </Popover>
                      )}
                      {typeof condition.content === 'string' && (
                        <div className="condition-value">{condition.content}</div>
                      )}
                      <CloseOutlined onClick={() => delCondition(condition)} />
                    </div>
                  )
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bigsearch
