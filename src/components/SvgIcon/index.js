import React, { useMemo } from 'react'
import { isExternal } from '@/utils/validate'
import './index.scss'
const SvgIcon = ({ iconClass, className, title, onClick }) => {
  const isExternalFn = isExternal
  let isExternalVal = useMemo(() => isExternalFn(iconClass), [iconClass])
  let iconName = useMemo(() => `#icon-${iconClass}`, [iconClass])
  let svgClass = useMemo(() => {
    if (className) {
      return 'svg-icon ' + className
    } else {
      return 'svg-icon'
    }
  }, [className])
  let styleExternalIcon = useMemo(() => {
    return {
      mask: `url(${iconClass}) no-repeat 50% 50%`,
      '-webkit-mask': `url(${iconClass}) no-repeat 50% 50%`,
    }
  }, [iconClass])
  return (
    <>
      {isExternalVal ? (
        <div style={styleExternalIcon} className="svg-external-icon svg-icon" onClick={onClick}></div>
      ) : (
        <svg className={`mySvg ${svgClass} ${iconClass}`} aria-hidden="true" onClick={onClick}>
          <use xlinkHref={iconName} />
          <title>{title}</title>
        </svg>
      )}
    </>
  )
}
export default SvgIcon
