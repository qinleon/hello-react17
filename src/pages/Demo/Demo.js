import React, { Component } from 'react'
import { Button, Select } from 'antd'
import { connect } from 'react-redux'
import { increment, decrement } from '@src/store/actions'
import store from '@src/store/store'
const { Option } = Select
console.log('进入Demo')
class Demo extends Component {
  state = {
    selectNumber: 1,
  }
  componentDidMount() {}
  increment = () => {
    console.log(store)
    const { selectNumber } = this.state
    this.props.increment(selectNumber)
  }
  decrement = () => {
    const { selectNumber } = this.state
    store.dispatch(decrement(selectNumber))
  }
  changeSelect = value => {
    this.setState({ selectNumber: value })
  }
  render() {
    return (
      <div>
        <h1>当前求和为{this.props.count}</h1>
        <Select
          style={{ width: '200px' }}
          value={this.state.selectNumber}
          onChange={value => {
            this.changeSelect(value)
          }}
        >
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
        </Select>
        <Button
          onClick={() => {
            this.increment()
          }}
        >
          +
        </Button>
        <Button
          onClick={() => {
            this.decrement()
          }}
        >
          -
        </Button>
      </div>
    )
  }
}

export default connect(state => ({ count: state.count }), {
  increment,
})(Demo)
