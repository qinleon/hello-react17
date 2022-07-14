/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-07-13 10:39:20
 * @LastEditors: Qleo
 * @LastEditTime: 2022-07-14 16:29:47
 */
import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { getExecGopSave } from '../../../api/auth/productClassAPI.js'

import { Button } from 'antd'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}

const AddProductGroupModal = () => {
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const [checkNick, setCheckNick] = useState(false)

  useEffect(() => {
    form.validateFields(['nickname'])
  }, [checkNick, form])

  const showModal = () => {
    setVisible(true)
  }
  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      getExecGopSave(values)
        .then(res => {
          setConfirmLoading(false)
          setVisible(false)
          message.success('操作成功！')
        })
        .catch(() => {
          setConfirmLoading(false)
        })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const handleCancel = () => {
    console.log('Clicked cancel button')
    setVisible(false)
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        添加
      </Button>
      <Modal
        title="Title"
        forceRender
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item
            {...formItemLayout}
            name="name"
            label="名称"
            rules={[
              {
                required: true,
                message: 'Please input your name'
              }
            ]}
          >
            <Input placeholder="Please input your name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddProductGroupModal
