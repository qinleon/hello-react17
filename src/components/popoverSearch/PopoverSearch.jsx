import React, { useState, useMemo, Fragment } from 'react'
import { getPinyin } from '@/utils/util'
import _debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import { Checkbox, Popover, Input } from 'antd'
import './index.scss'
function PopoverSearch(props) {
  const [checkedIdList, setCheckedIdList] = useState([])
  const [checkedProductList, setCheckedProductList] = useState([])
  const [filterIdList, setFilterIdList] = useState([])

  // 模糊搜索
  const fuzzySearch = _debounce(function (value, group) {
    group.filterIdList = group.children
      .filter(item => {
        return item.name.includes(value)
      })
      .map(item => item.id)
    judgeCheckAll(group)
  }, 500)

  const formatProductList = () => {
    props.productList.forEach(group => {
      group.indeterminate = false
      group.checkAll = false
      group.checkedNum = 0
    })
  }
  formatProductList()
  // 判断全选、半选状态
  const judgeCheckAll = group => {
    if (group.children?.length === 0 && checkedIdList.includes(group.id)) {
      group.checkAll = true
      return
    }
    // 过滤后的可见数据中选中的长度
    let viewCheckedLength = 0
    if (checkedIdList.length) {
      viewCheckedLength = checkedIdList.filter(code => {
        return filterIdList.includes(code)
      }).length
    }
    group.indeterminate = !!viewCheckedLength && viewCheckedLength < filterIdList.length
    group.checkAll = !!viewCheckedLength && viewCheckedLength === filterIdList.length
    group.checkedNum = group.children.filter(item => checkedIdList.includes(item.id)).length
  }
  // 全选
  const onCheckAllChange = (e, group) => {
    let checkedIds = []
    if (e.target.checked) {
      if (group.children?.length) {
        checkedIds = [...new Set(checkedIdList.concat(filterIdList))]
      } else {
        checkedIds = [group.id]
      }
    } else {
      if (group.children?.length) {
        checkedIds = checkedIdList.filter(item => {
          return !filterIdList.includes(item)
        })
      } else {
        checkedIds = []
      }
    }
    setCheckedIdList(checkedIds)
    let arr = []
    props.productList.forEach(group => {
      if (group.children?.length) {
        group.children.forEach(product => {
          if (checkedIds.includes(group.id)) {
            arr.push(group)
          }
        })
      } else {
        if (checkedIds.includes(group.id)) {
          arr.push(group)
        }
      }
    })
    setCheckedProductList(arr)
    props.onChange(checkedProductList)
  }
  // 单选
  const onCheckChange = (option, group) => {
    if (!checkedIdList.includes(option.id)) {
      checkedIdList.push(option.id)
    } else {
      checkedIdList.forEach((i, index) => {
        if (i === option.id) {
          checkedIdList.splice(index, 1)
        }
      })
    }
    setCheckedIdList(checkedIdList)
    const checkedOptionList = group.children.filter(item => {
      return checkedIdList.includes(item.id)
    })
    props.onChange(checkedOptionList)
    judgeCheckAll(group)
  }
  const visibleChange = (visible, group) => {
    if (!visible) {
      fuzzySearch('', group)
    }
  }
  return (
    <div className="PopoverSearch">
      {props.productList.map(group => {
        return (
          <Popover
            placement="bottom"
            getPopupContainer={e => e.parentNode}
            key={group.id}
            content={
              group.children.length && (
                <Fragment>
                  <Input.Search onSearch={value => fuzzySearch(value, group)} />
                  <div className="optionList">
                    {group.children.map(option => {
                      return (
                        filterIdList.includes(option.id) && (
                          <div key={option.id} className="option">
                            <Checkbox
                              checked={checkedIdList.includes(option.id)}
                              onChange={() => onCheckChange(option, group)}
                            >
                              {option.showIcon !== false && <svg-icon icon-class={getPinyin(option.name)} />}
                              <span style={{ marginLeft: '6px' }}>{option.name}</span>
                              <span>({option.number})</span>
                            </Checkbox>
                          </div>
                        )
                      )
                    })}
                  </div>
                </Fragment>
              )
            }
            onOpenChange={visible => visibleChange(visible, group)}
          >
            <Checkbox
              style={{ userSelect: 'none', marginRight: '10px' }}
              indeterminate={group.indeterminate}
              checked={group.checkAll}
              onChange={e => onCheckAllChange(e, group)}
            >
              {group.children && group.children.length ? (
                <span>
                  <span>{group.name}</span>
                  {group.checkedNum ? `(${group.checkedNum})` : ''}
                </span>
              ) : (
                <span>
                  {group.name}({group.number})
                </span>
              )}
            </Checkbox>
          </Popover>
        )
      })}
    </div>
  )
}
PopoverSearch.prototypes = {
  productList: PropTypes.array,
  checkedList: PropTypes.array,
}
PopoverSearch.defaultProps = {
  productList: [],
  checkedList: [],
}
export default PopoverSearch
