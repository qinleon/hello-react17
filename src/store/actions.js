import { getOrderlist, removeOrderlist, addOrderlist, updateOrderlist } from '../api/orderlist'

//查询
export const All = seardata => async dispatch => {
  //外层函数的返回值是一个函数
  let data = await getOrderlist(seardata)

  dispatch({
    type: 'CHANGEDATA',
    payload: data,
  })
}

//删除
export const DEl = id => async dispatch => {
  console.log('DEL执行了')
  await removeOrderlist(id)

  let data = await getOrderlist()
  // console.log('删除后的data',data);
  dispatch({
    type: 'DELDATA',
    payload: data,
  })
}

//添加
export const ADD = datainfo => async dispatch => {
  console.log('保存时传来的datainfo', datainfo)
  await addOrderlist(datainfo)
  let data = await getOrderlist()

  dispatch({
    type: 'ADDORDER',
    payload: data,
  })
}

//修改
export const UPD = setparams => async dispatch => {
  // console.log('修改派发来的参数',setparams);
  await updateOrderlist(setparams.id, setparams.data)
  let data = await getOrderlist()

  dispatch({
    type: 'UPDATT',
    payload: data,
  })
}

//load的显示与隐藏
export const SHOWLOAD = payload => ({
  type: 'SHOWLOAD',
  payload,
})

// export const login = (params) => {
//   return new Promise((resolve, reject) => {
//     loginAPI(params)
//       .then(response => {
//         const { data } = response
//         sessionStorage.clear()
//         // const { token, name, userId, username, homeUrl } = data
//         commit('SET_TOKEN', data)
//         setToken(data)
//         resolve()
//       })
//       .catch(error => {
//         reject(error)
//       })
//   })
// }
