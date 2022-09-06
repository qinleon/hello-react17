let isload = 'false'

const load = function (loading = isload, action) {
  const { type, payload } = action
  switch (type) {
    case 'SHOWLOAD':
      return payload
    default:
      break
  }

  return loading
}
export default load
