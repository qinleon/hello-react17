import React, { useEffect, useMemo, useState } from 'react'
import Qrcode from '@src/components/qrcode/qrcode'
import { getPinyin } from '@src/utils/util'
import SvgIcon from '@/components/SvgIcon' // svg component
import './baseInfo-template.scss'
import { connect } from 'react-redux'
const BaseInfo = props => {
  console.log('BaseInfo')
  const { info, qrcode, delBtn } = props
  let [qrcodeUrl, setQrcodeUrl] = useState('')
  let [qrcodeVisible, setQrcodeVisible] = useState(false)
  const createSlot = slotName => {
    let children = props.children
    if (typeof children === 'object' && !Array.isArray(children)) {
      children = [children]
    }
    if (children) {
      for (let el of children) {
        if (el?.props.slot === slotName) {
          return el
        }
      }
    }
    return null
  }
  const esDoc = useMemo(() => info.esDoc || {}, [info])
  useEffect(() => {}, [])

  const getDataType = info => {
    return info.accountTypeName || info.commentTypeName || info.dataTypeName
  }
  const getSourceType = sourceType => {
    return props.allDictNameMap.sourceType[sourceType]
  }
  const del = () => {
    // store.dispatch(subAction(5))
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
        <span title={`来源：${getSourceType(info.sourceType)}`} onClick={props.increment}>
          来源：{getSourceType(info.sourceType)}
        </span>
        <div className="verticalLine"></div>
        <span title={`产品名称：${info.productName}`} onClick={props.sub}>
          产品名称： <SvgIcon iconClass={getPinyin(info.productName)} className="mr6" /> {info.productName}
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
          {createSlot('beforeBtn')}
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
        <span v-if="$slots.afterBtn">{createSlot('afterBtn')}</span>
      </div>
      <Qrcode url={qrcodeUrl} visible={qrcodeVisible} onClose={closeQrcode}></Qrcode>
    </div>
  )
}
// 1.mapStateToProps方法：告诉React-Redux, 需要将store中保存的哪些数据映射到当前组件的props上
const mapStateToProps = state => {
  return {
    allDictNameMap: state.allDictNameMap,
  }
}
export default connect(mapStateToProps)(BaseInfo)
