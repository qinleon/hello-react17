var data = []

export default (db = data, action) => {
  const { type, payload } = action

  switch (type) {
    case 'CHANGEDATA':
      payload.forEach((item, idx) => (item.key = idx))
      return payload

    case 'DELDATA':
      payload.forEach((item, idx) => (item.key = idx))
      return payload

    case 'ADDORDER':
      payload.forEach((item, idx) => (item.key = idx))
      return payload

    case 'UPDATT':
      payload.forEach((item, idx) => (item.key = idx))
      console.log('修改后传来的payload', payload)
      return payload
    default:
      return ''
  }

  return db
}
