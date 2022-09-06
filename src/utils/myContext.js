import { createContext } from 'react'

export const { Provider, Consumer } = createContext({
  isshowAdduser: false,
})

export function casAuth(URL) {
  console.log('casAuth')
  let APPID = null
  if (process.env.NODE_ENV === 'production') {
    switch (window.projectConfig.NET_TYPE) {
      case 'private':
        APPID = '287de6ba4387c5dcb24bae1d51784dbd'
        break
      default:
        APPID = '5a390af48810f7472536c14dd0567ca2'
        break
    }
  } else {
    APPID = '5a390af48810f7472536c14dd0567ca2'
  }
  const tempUrl = `http://10.170.130.240:32415/cas/oauth2.0/authorize?response_type=code&bypass_approval_prompt=true&client_id=${APPID}&redirect_uri=${URL}`
  const casLoginUrl = `http://10.170.130.240:32415/cas/login?service=${encodeURIComponent(tempUrl)}`
  const domA = document.createElement('a')
  domA.setAttribute('href', casLoginUrl)
  domA.click()
}
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
