import { INCREMENT, DECREMENT } from './constant'
let initialState = {
  count: 0,
}
const reducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case 'setDataTypeList':
      const map = new Map()
      const indexMap = new Map()
      function digui(arr) {
        arr.forEach(item => {
          item.dataTypeCode = item.enumCode
          item.dataTypeIndex = item.enumIndex
          item.dataTypeName = item.enumName
          map.set(item.dataTypeCode, item)
          indexMap.set(item.dataTypeIndex, item)
          delete item.enumCode
          delete item.enumIndex
          delete item.enumName
          if (item.children && item.children.length) {
            digui(item.children)
          }
        })
      }
      digui(payload)
      return { ...state, dataTypeCodeMap: map, dataTypeIndexMap: indexMap, dataTypeList: payload }

    case 'setAllDictMap':
      const arrSort = payload.sort((a, b) => {
        if (a.dictType > b.dictType) {
          return 1
        } else {
          return -1
        }
      })
      let allDictNameMap = {}
      let allDictMap = {}
      arrSort.forEach(item => {
        const codeNameObj = {}
        item.dictContent?.forEach(item2 => {
          codeNameObj[item2.dictType] = item2.dictName
        })
        allDictMap[item.dictType] = item
        allDictNameMap[item.dictType] = codeNameObj
      })
      allDictMap = new Proxy(allDictMap, {
        get: function (target, propKey, receiver) {
          const res = Reflect.get(target, propKey, receiver)
          return res || { dictContent: [] }
        },
      })
      allDictNameMap = new Proxy(allDictNameMap, {
        get: function (target, propKey, receiver) {
          const res = Reflect.get(target, propKey, receiver)
          return res || {}
        },
      })
      return { ...state, allDictMap, allDictNameMap }

    case INCREMENT:
      return { ...state, count: state.count + payload * 1 }

    case DECREMENT:
      return { ...state, count: state.count - payload * 1 }

    default:
      return state
  }
}

export default reducer
