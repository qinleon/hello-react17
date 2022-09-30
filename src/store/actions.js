import { dicList, getDataTypeListAPI } from '@/api/dic'

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
