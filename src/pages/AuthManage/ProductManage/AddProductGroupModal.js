/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-07-13 10:39:20
 * @LastEditors: Qleo
 * @LastEditTime: 2022-07-14 14:42:12
 */
import { Modal, Form, Input, message } from 'antd'
import React from 'react'
import { getExecGopSave } from '../../../api/auth/productClassAPI.js'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}
class CustomizedForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      form: {
        id: '',
        name: ''
      }
    }
  }
  addProductGroup = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        getExecGopSave(this.form).then(res => {
          message.success('操作成功！')
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form.Item {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please input your name'
              }
            ]
          })(<Input placeholder="Please input your name" />)}
        </Form.Item>
      </div>
    )
  }
}

const AddFrom = Form.create({})(CustomizedForm)

export default class AddProductGroupModal extends React.Component {
  handleCancel = () => {
    console.log('Clicked cancel button')
  }

  render() {
    return (
      <div>
        <Modal
          title="Title"
          visible={this.props.visible}
          onOk={this.addProductGroup}
          confirmLoading={this.confirmLoading}
          onCancel={this.handleCancel}
        >
          <AddFrom></AddFrom>
        </Modal>
      </div>
    )
  }
}
