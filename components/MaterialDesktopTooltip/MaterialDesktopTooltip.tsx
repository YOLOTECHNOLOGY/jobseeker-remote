import React from 'react'
import Tooltip from '@mui/material/Tooltip'

interface MaterialDesktopTooltipProps {
  icon: string
  className: string
  title: string
  placement?: any
}

const MaterialDesktopTooltip = ({
  icon,
  className,
  title,
  placement='top'
}: MaterialDesktopTooltipProps) => {
  return (
    <Tooltip 
      title={title}
      placement={placement}
      arrow
    >
      <span className={className}>
        <img 
          src={icon} 
          alt='icon' 
          width='14'
          height='14'
        />
      </span>
    </Tooltip>
  )
}
export default MaterialDesktopTooltip
