import React, { useMemo } from 'react'
import BaseInfo from './baseInfo-template'
import defalutImage from '@src/assets/tasklist-error.png'
import { withRouter } from 'react-router-dom'
import './SubtaskTemplate.scss'
const SubtaskTemplate = props => {
  const { info, tag, qrcode, delBtn } = props
  let typeObj = {
    MC_ACCOUNT: '账号',
    MC_GROUP: '群组',
    MC_APPLICATION: '应用',
    MC_CONTENT: '内容',
    comment: '评论',
    MC_PLATES: '版块',
    MC_LIVE_STREAM: '直播',
  }
  let map = {
    reg_type: {
      0: '未认证',
      1: '未认证',
      2: '实名认证',
    },
  }
  const esDoc = useMemo(() => info.esDoc || {}, [info])

  const del = () => {
    this.$emit('del', this.info)
  }
  const goToDetail = () => {
    if (!this.info.esDoc._id || !this.info.esDoc._index) {
      return
    }
    const params = {
      targetUrl: '/app/article-detail/content', // 详情页面路径
      docId: this.info.esDoc._id,
      index: this.info.esDoc._index,
      msg_id: this.info.esDoc.msg_id,
      search_type: () => {
        // 5群组，6账号，7板块，8应用，9直播，0内容（默认）,评论4，微博3
        if (this.info.productCode === 'd2f2ba3fd3199387') {
          // 微博特殊判断
          return 3
        } else {
          return {
            MC_ACCOUNT: 6,
            MC_GROUP: 5,
            MC_APPLICATION: 8,
            MC_PLATES: 7,
            MC_LIVE_STREAM: 9,
            comment: 4,
          }[this.info.mcObjectCode]
        }
      },
    }
    const tempHref = `${window.projectConfig.ES_DETAIL_URL}?external=${encodeURIComponent(JSON.stringify(params))}`
    const domA = document.createElement('a')
    domA.setAttribute('target', '_blank')
    domA.setAttribute('href', tempHref)
    domA.click()
  }

  return (
    <div className="SubtaskTemplate">
      <div className="flex">
        {tag && <div className={`tag ${info.mcObjectCode}`}>{typeObj[info.mcObjectCode]}</div>}
        {info.mcObjectCode === 'MC_ACCOUNT' && esDoc.author_img_url && (
          <img v-img-error="esDoc.author_img_url" className="cover" src={defalutImage} onClick={goToDetail} alt="" />
        )}
        {info.mcObjectCode === 'MC_APPLICATION' && esDoc.logo_url && (
          <img v-img-error="esDoc.logo_url" className="cover" src={defalutImage} onClick={goToDetail} alt="" />
        )}
        {(info.mcObjectCode === 'MC_PLATES' ||
          info.mcObjectCode === 'MC_CONTENT' ||
          info.mcObjectCode === 'MC_LIVE_STREAM') &&
          esDoc.lpic &&
          esDoc.lpic[0] && (
            <img
              v-img-error="esDoc.lpic && esDoc.lpic[0]"
              className="cover"
              src={defalutImage}
              onClick={goToDetail}
              alt=""
            />
          )}
        <div className="right-container flex-1 flex-column flex-between">
          <div className="right-header flex-between flex-center-v" style={{ lineHeight: '24px' }}>
            <div className="flex">
              {esDoc.id && (
                <div className="name-wrap" onClick={goToDetail}>
                  {info.mcObjectCode === 'MC_ACCOUNT' && esDoc.author_name && (
                    <div className="name">
                      <span dangerouslySetInnerHTML={{ __html: esDoc.author_name || '——' }}></span>
                    </div>
                  )}
                  {info.mcObjectCode === 'MC_APPLICATION' && esDoc.title && (
                    <div className="name">
                      <span dangerouslySetInnerHTML={{ __html: esDoc.title || '——' }}></span>
                    </div>
                  )}
                  {info.mcObjectCode === 'MC_GROUP' && esDoc.e_name && (
                    <div className="name">
                      <span dangerouslySetInnerHTML={{ __html: esDoc.e_name }}></span>
                    </div>
                  )}
                  {info.mcObjectCode === 'MC_CONTENT' && info.dataTypeCode !== 'REVIEW' && (
                    <div className="name">
                      <span dangerouslySetInnerHTML={{ __html: esDoc.title || '——' }}></span>
                    </div>
                  )}
                  {info.mcObjectCode === 'MC_CONTENT' && info.dataTypeCode === 'REVIEW' && (
                    <div className="name">
                      <span dangerouslySetInnerHTML={{ __html: esDoc.cont || '——' }}></span>
                    </div>
                  )}
                  {info.mcObjectCode === 'MC_PLATES' && esDoc.e_name && (
                    <div className="name">
                      <span dangerouslySetInnerHTML={{ __html: esDoc.e_name || '——' }}></span>
                    </div>
                  )}
                  {info.mcObjectCode === 'MC_LIVE_STREAM' && esDoc.title && (
                    <div className="name">
                      <span dangerouslySetInnerHTML={{ __html: esDoc.title || '——' }}></span>
                    </div>
                  )}
                </div>
              )}
              {info.greyOrWhite === 'WHITE' && <div className="white-tag">白名单不支持下发</div>}
              {info.greyOrWhite === 'GREY' && <div className="grey-tag">灰名单</div>}
              {info.greyOrWhite === 'BLACK' && <div className="black-tag">黑名单</div>}
              <slot name="operation"></slot>
            </div>
            <div className="flex-right-top flex">
              {info.mcObjectCode === 'MC_ACCOUNT' && (
                <div className="flex-center-v">
                  {map['reg_type'][esDoc.reg_type] && <span> 认证类型：{map['reg_type'][esDoc.reg_type]} </span>}
                  {esDoc.nfan && <span> 粉丝数：{esDoc.nfans}</span>}
                  {esDoc.nfol && <span> 关注数：{esDoc.nfol}</span>}
                  {esDoc.npost && <span> 发文数：{esDoc.npost}</span>}
                </div>
              )}
              {info.publishTime && (
                <div title={`创建时间：${info.publishTime}`} className="createtime">
                  创建时间：{info.publishTime}
                </div>
              )}
            </div>
          </div>
          <div className="content-wrap" onClick={goToDetail}>
            {info.mcObjectCode === 'MC_ACCOUNT' && (
              <div className="right-middle">
                <span dangerouslySetInnerHTML={{ __html: esDoc.author_desc }}></span>
              </div>
            )}
            {info.mcObjectCode === 'MC_APPLICATION' && (
              <div className="right-middle">
                <span dangerouslySetInnerHTML={{ __html: esDoc.e_desc || esDoc.cont }}></span>
              </div>
            )}
            {info.mcObjectCode === 'MC_CONTENT' && info.dataTypeCode !== 'REVIEW' && (
              <div className="right-middle">
                <span dangerouslySetInnerHTML={{ __html: esDoc.abstr || esDoc.cont }}></span>
              </div>
            )}
            {info.mcObjectCode === 'MC_PLATES' && (
              <div className="right-middle">
                <span dangerouslySetInnerHTML={{ __html: esDoc.e_desc }}></span>
              </div>
            )}
            {info.mcObjectCode === 'MC_LIVE_STREAM' && (
              <div className="right-middle">
                <span dangerouslySetInnerHTML={{ __html: esDoc.abstr || esDoc.cont }}></span>
              </div>
            )}
            {info.mcObjectCode === 'MC_GROUP' && (
              <div className="right-middle">
                <span dangerouslySetInnerHTML={{ __html: esDoc.e_desc }}></span>
              </div>
            )}
          </div>
          <BaseInfo info={info} qrcode={qrcode} del-btn={delBtn} onDel={del}>
            <slot name="beforeBtn"></slot>
            <slot name="afterBtn"></slot>
          </BaseInfo>
        </div>
      </div>
    </div>
  )
}
export default withRouter(SubtaskTemplate)
