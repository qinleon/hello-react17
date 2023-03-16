import React, { Component } from 'react'
import { Button, Select } from 'antd'
import { useState } from 'react'
import reactDom from 'react-dom'
console.log('进入Demo')
class Demo extends Component {
  state = {
    count: 0,
  }
  myRef = React.createRef()
  componentDidMount() {
    this.timer = setInterval(() => {
      let count = this.state.count
      this.setState({ count: ++count })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  show = () => {
    console.log(this.myRef.current.value)
  }
  render() {
    return (
      <div>
        <h1>当前求和为{this.state.count}</h1>
        <input type="text" ref={this.myRef} />
        <button onClick={this.show}>展示</button>
      </div>
    )
  }
}

const Demo2 = props => {
  let [count, setCount] = useState(0)
  const myRef = React.useRef()
  React.useEffect(() => {
    let timer = setInterval(() => {
      setCount(++count)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  const show = () => {
    console.log(myRef.current.value)
  }
  return (
    <>
      <h1>当前求和为{count}</h1>
      <input type="text" ref={myRef} />
      <button onClick={show}>展示</button>
    </>
  )
}

export default Demo2
