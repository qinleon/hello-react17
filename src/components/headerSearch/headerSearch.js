import React, { useState, useEffect } from 'react'
import { DatePicker, Button, Popover } from 'antd'
import './headerSearch.scss'
import moment from 'moment'
import ColumnGroup from 'antd/lib/table/ColumnGroup'

const { RangePicker } = DatePicker
const HeaderSearch = props => {
  let myOptions = props.options

  let [options, setOptions] = useState(myOptions)
  let _result = {}
  options.forEach(option => {
    _result[option.value] = ''
  })
  let [result, setResult] = useState(_result)
  useEffect(() => {
    myOptions.forEach(option => {
      option.children.unshift({
        label: '全部',
        value: 'all',
      })
      if (option.type === 'date') {
        option.children.forEach(optionItem => {
          if (optionItem.type === 'custom') {
            optionItem.customTime = []
          }
        })
      }
    })
    setOptions(myOptions)
    myOptions.forEach(option => {
      _result[option.value] = ''
    })
    setResult(_result)
  }, [myOptions])

  // 点击选项
  const clickOptionItem = (option, optionItem) => {
    if (optionItem.value === 'all') {
      // 点击全选
      option.children.forEach(item => {
        item.active = item.value === 'all' ? true : false
      })
    } else {
      option.children.forEach(item => {
        if (item.value === 'all') {
          item.active = false
        }
        if (option.multipSelect) {
          // 多选
          optionItem.active = !optionItem.active
        } else {
          // 单选
          if (item.value === optionItem.value && item.type === optionItem.type) {
            item.active = true
          } else {
            item.active = false
          }
        }
      })
    }
    option.children.forEach(optionItem => {
      if (optionItem.active) {
        setCurData(option, optionItem)
      }
    })
    setOptions([...options])
  }
  const setCurData = (option, optionItem) => {
    if (option.type === 'date') {
      if (optionItem.type === 'hour') {
        result[option.value] = {
          startTime: moment().subtract(Number(optionItem.value), 'hours').valueOf(),
          endTime: moment().valueOf(),
        }
      } else if (optionItem.type === 'day') {
        result[option.value] = {
          startTime: moment().subtract(Number(optionItem.value), 'days').valueOf(),
          endTime: moment().valueOf(),
        }
      } else if (optionItem.type === 'custom') {
        result[option.value] = {
          startTime: optionItem.customTime[0]?.valueOf(),
          endTime: optionItem.customTime[1]?.valueOf(),
        }
      }
    } else {
      result[option.value] = optionItem.value
    }
    console.log(result)
    setResult(result)
    props.onChange(result)
  }
  const changeCustomTime = (option, level1, dates) => {
    level1.customTime = dates
    setCurData(option, level1)
  }
  return (
    <div className="headerSearch">
      {options.map(option => {
        return (
          <React.Fragment key={option.label}>
            <div className="label">{option.label}</div>
            <div className="content flex">
              {option.children.map(level1 => {
                return level1.children?.length ? (
                  <React.Fragment key={option.label + level1.value + level1.type}>
                    <Popover
                      placement="bottom"
                      trigger="click"
                      getPopupContainer={e => e}
                      content={
                        <div>
                          {level1.children.map(level2 => {
                            return (
                              <div
                                className={`option-item ${level2.active ? 'active' : ''}`}
                                onClick={() => clickOptionItem(option, level2)}
                                key={option.label + level2.value + level2.type}
                              >
                                {level2.label}
                              </div>
                            )
                          })}
                        </div>
                      }
                    >
                      <div
                        className={`option-item ${level1.active ? 'active' : ''}`}
                        onClick={() => clickOptionItem(option, level1)}
                      >
                        {level1.label}
                      </div>
                    </Popover>
                  </React.Fragment>
                ) : (
                  <React.Fragment key={option.label + level1.value + level1.type}>
                    <div
                      className={`option-item ${level1.active ? 'active' : ''}`}
                      onClick={() => clickOptionItem(option, level1)}
                    >
                      {level1.label}
                    </div>
                    {level1.type === 'custom' && level1.active ? (
                      <RangePicker
                        showTime
                        value={level1.customTime}
                        onChange={dates => changeCustomTime(option, level1, dates)}
                      />
                    ) : null}
                  </React.Fragment>
                )
              })}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default HeaderSearch
