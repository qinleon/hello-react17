import React, { useMemo, useState } from 'react'
import Qrcode from '@src/components/qrcode/qrcode'
import { getPinyin } from '@src/utils/util'
import SvgIcon from '@/components/SvgIcon' // svg component
import './baseInfo-template.scss'
const BaseInfo = props => {
  const { info, qrcode, delBtn } = props
  let [qrcodeUrl, setQrcodeUrl] = useState('')
  let [qrcodeVisible, setQrcodeVisible] = useState(false)
  let dataTypeList = []
  let sourceTypeList = []

  const esDoc = useMemo(() => info.esDoc || {}, [info])

  const getDataType = info => {
    return info.accountTypeName || info.commentTypeName || info.dataTypeName
  }
  const getSourceType = sourceType => {
    // return store.state.dic.allDictNameMap.sourceType[sourceType]
  }
  const del = () => {
    // this.$emit('del', this.info)
  }
  const openQrcode = url => {
    if (url) {
      setQrcodeUrl(url)
      setQrcodeVisible(true)
    }
  }
  const closeQrcode = () => {
    setQrcodeVisible(false)
  }
  return (
    <div className="BaseInfo comment-footer flex-between">
      <div className="base-left flex-center-v">
        <span title={`来源：${getSourceType(info.sourceType)}`}>来源：{getSourceType(info.sourceType)}</span>
        <div className="verticalLine"></div>
        <span title={`产品名称：${info.productName}`}>
          产品名称： <svg-icon icon-class={getPinyin(info.productName)} className="mr6" /> {info.productName}
        </span>
        <div className="verticalLine"></div>
        <span title={`数据类型：${getDataType(info)}`}>数据类型：{getDataType(info)}</span>
        <div className="verticalLine"></div>
        <span className="item-id" title={`ID：${info.uid}`}>
          ID：{info.uid}
        </span>
        <div className="verticalLine"></div>
        <span title={`创建人：${info.creator}`}>创建人：{info.creator}</span>
        <div className="verticalLine"></div>
        <span title={`任务创建时间：${info.createTime}`}>任务创建时间：{info.createTime}</span>
      </div>
      <div className="base-right">
        <span v-if="$slots.beforeBtn" style={{ marginLeft: '18px' }}>
          <slot name="beforeBtn"></slot>
        </span>
        {qrcode && (esDoc.own_url || esDoc.rt_url || esDoc.url || info.url) ? (
          <SvgIcon
            style={{ marginLeft: '18px' }}
            iconClass="icon-qrcode"
            title="二维码"
            onClick={() => openQrcode(esDoc.own_url || esDoc.rt_url || esDoc.url || info.url)}
          />
        ) : (
          <div style={{ display: ' inline-block', width: '14px', marginLeft: '18px' }}></div>
        )}
        {delBtn && <SvgIcon iconClass="yichu" style={{ marginLeft: '18px' }} title="移除" onClick={del} />}
        <span v-if="$slots.afterBtn">
          <slot name="afterBtn"></slot>
        </span>
      </div>
      <Qrcode url={qrcodeUrl} visible={qrcodeVisible} onClose={closeQrcode}></Qrcode>
    </div>
  )
}
export default BaseInfo
