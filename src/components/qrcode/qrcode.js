import { copyToBoard } from '@src/utils/util'
import React from 'react'
import { Button, Modal } from 'antd'
import QRCode from 'qrcode.react'
const Qrcode = ({ visible, url, onClose }) => {
  const myCopyToBoard = () => {
    copyToBoard(url)
  }
  return (
    <>
      <Modal
        visible={visible}
        maskClosable={true}
        zIndex={1001}
        footer={[
          <Button key="submit" type="primary" onClick={onClose}>
            关闭
          </Button>,
        ]}
        onCancel={onClose}
      >
        {url && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QRCode value={url} size={256} id="qrCode" />
          </div>
        )}
        <div style={{ textAlign: 'center', fontSize: '16px', marginTop: '12px', marginBottom: '4px' }}>
          打开手机扫一扫，访问url页面查看详情
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type="link" style={{ fontSize: '16px' }} onClick={myCopyToBoard}>
            复制链接
          </Button>
        </div>
      </Modal>
    </>
  )
}
export default Qrcode
