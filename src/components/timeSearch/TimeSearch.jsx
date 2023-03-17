// <!--
// eg:
// <TimeSearch :value="[3, ['1672070400000', '1672365556808']]" @change="publishTimeChange(arguments)" />
// -->
import { Radio, DatePicker } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import 'moment/locale/zh-cn'
const { RangePicker } = DatePicker
moment.locale('zh-cn')
const TimeSearch = props => {
  const [time, setTime] = useState([])
  const [timeType, setTimeType] = useState('0')
  const formatTime = myTimeType => {
    const now = moment().format('x')
    if (myTimeType === 'custom') {
      return
    } else if (myTimeType === '') {
      return []
    } else {
      return [moment().subtract(Number(myTimeType), 'days').startOf('day').format('x'), now]
    }
  }
  const timeChange = ({ target: { value } }) => {
    let myTime = formatTime(value)
    props.onChange(value, JSON.parse(JSON.stringify(myTime || time)))
    setTimeType(value)
    setTime(myTime)
  }
  const rangePickerOk = moments => {
    let _time = moments.map(time => moment(time).format('x'))
    setTime(_time)
    props.onChange(timeType, JSON.parse(JSON.stringify(_time)))
  }

  useEffect(() => {
    setTimeType(props.value.type)
    setTime(props.value.time || [])
    formatTime(props.value.type)
  }, [props.value])
  return (
    <div className="TimeSearch">
      <div className="row-content">
        <Radio.Group onChange={timeChange} options={props.optionList} value={timeType}></Radio.Group>
        {timeType === 'custom' && (
          <RangePicker
            onChange={rangePickerOk}
            showTime={{
              format: 'HH:mm:ss',
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
          />
        )}
      </div>
    </div>
  )
}
TimeSearch.defaultProps = {
  optionList: [
    { label: '今天', value: '0' },
    { label: '3天', value: '3' },
    { label: '7天', value: '7' },
    { label: '自定义', value: 'custom' },
  ],
}
export default TimeSearch
