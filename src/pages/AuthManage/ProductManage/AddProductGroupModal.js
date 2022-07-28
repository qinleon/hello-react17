/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-07-13 10:39:20
 * @LastEditors: Qleo
 * @LastEditTime: 2022-07-21 17:51:24
 */
import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { getExecGopSave } from '../../../api/auth/productClassAPI.js'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
}

const AddProductGroupModal = props => {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const { formData } = props

  useEffect(() => {
    form.setFieldsValue({
      name: formData.name,
    })
  }, [form, formData])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      getExecGopSave({ id: props.formData.id, ...values })
        .then(res => {
          setConfirmLoading(false)
          message.success('操作成功！')
          props.onSuccess()
          props.onCancel()
        })
        .catch(() => {
          setConfirmLoading(false)
          props.onCancel()
        })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const handleCancel = () => {
    props.onCancel()
  }

  return (
    <>
      <Modal
        title="Title"
        forceRender
        visible={props.visible}
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
                message: 'Please input your name',
              },
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
