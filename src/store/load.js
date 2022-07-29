let isload = 'false'

export default function (loading = isload, action) {
  const { type, payload } = action

  switch (type) {
    case 'SHOWLOAD':
      return payload
  }

  return loading
}
