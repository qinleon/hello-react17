import { useEffect, useState, useCallback } from 'react'

const useSyncCallback = (callback, ...arg) => {
  const [proxyState, setProxyState] = useState({ current: false })

  const Func = useCallback(() => {
    setProxyState({ current: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proxyState])

  useEffect(() => {
    proxyState.current && callback(...arg)
    if (proxyState.current === true) setProxyState({ current: false })
  })

  return Func
}

export default useSyncCallback
