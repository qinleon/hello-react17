import { message } from 'antd'
// 根据汉字获取拼音
import { pinyin } from 'pinyin-pro'

// 复制文字到粘贴板
export function copyToBoard(text) {
  const textarea = document.createElement('textarea')
  document.body.appendChild(textarea)
  textarea.value = text
  textarea.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    message.success('复制成功')
  }
  document.body.removeChild(textarea)
}
export function getPinyin(chinaName) {
  if (chinaName === '脉脉') {
    return 'maimai'
  }
  return pinyin(chinaName, { toneType: 'none' }).replace(/\s+/g, '').toLocaleLowerCase()
}
