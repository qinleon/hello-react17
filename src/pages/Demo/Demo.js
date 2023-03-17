import React, { useState } from 'react'

export default function Demo(props) {
  const [person, setPerson] = useState({ name: '张三' })
  const changeName = () => {
    setPerson({ name: '李四' })
    addAge()
  }
  const addAge = () => {
    setPerson({ name: '李四', age: 18 })
    props.onChange(person)
  }
  return (
    <div>
      姓名：{person.name}
      <button onClick={changeName}>点击改名</button>
    </div>
  )
}
