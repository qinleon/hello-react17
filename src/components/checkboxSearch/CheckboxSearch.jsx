import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'

const CheckboxSearch = props => {
  const [checkedList, setCheckedList] = useState([])
  useEffect(() => {
    if (props.value.length === 0) {
      setCheckedList([''])
    } else {
      setCheckedList(props.value)
    }
  }, [props.value])

  const change = checkeds => {
    let _checkedList
    // 如果点击了‘不限’，或没有勾选，则传['']
    if (checkeds[checkeds.length - 1] === '' || checkeds.length === 0) {
      _checkedList = ['']
    } else {
      _checkedList = checkeds.filter(item => item !== '')
    }
    setCheckedList(_checkedList)
    props.onChange(_checkedList)
  }
  return (
    <div className="CheckboxSearch">
      <Checkbox.Group value={checkedList} onChange={change}>
        {props.optionList.map(item => {
          return (
            <Checkbox key={item.value} value={item.value}>
              {item.name}
            </Checkbox>
          )
        })}
      </Checkbox.Group>
    </div>
  )
}
CheckboxSearch.propTypes = {
  optionList: PropTypes.array,
  value: PropTypes.array,
}
CheckboxSearch.defaultProps = {
  optionList: [
    { value: '', name: '不限' },
    { value: 'A', name: '简体' },
    { value: 'B', name: '繁体' },
    { value: 'C', name: '英文' },
  ],
  value: [''],
}
export default CheckboxSearch
