import { dicList, getDataTypeListAPI } from '@/api/dic'
import { INCREMENT, DECREMENT } from './constant'
export const getDataTypeList = () => async dispatch => {
  let data = await getDataTypeListAPI()
  dispatch({
    type: 'setDataTypeList',
    payload: data.data,
  })
}
export const getDictList = () => async dispatch => {
  let data = await dicList({})
  dispatch({ type: 'setAllDictMap', payload: data.data })
}

export const increment = payload => dispatch => {
  setTimeout(() => {
    dispatch({ type: INCREMENT, payload })
  }, 1000)
}

export const decrement = payload => {
  return { type: DECREMENT, payload }
}
