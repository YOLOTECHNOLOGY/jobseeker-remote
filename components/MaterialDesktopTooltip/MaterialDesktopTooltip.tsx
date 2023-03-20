import React from 'react'
import Tooltip from '@mui/material/Tooltip'

interface MaterialDesktopTooltipProps {
  icon: string
  className: string
  title: string
  placement?: any
  style?:any
}

const MaterialDesktopTooltip = ({
  icon,
  className,
  title,
  placement='top',
  ...rest
}: MaterialDesktopTooltipProps) => {
  return (
    <Tooltip 
      title={title}
      placement={placement}
      arrow
      {...rest}
    >
      <span className={className}>
        <img 
          src={icon} 
          alt='Verified Employer' 
          width='14'
          height='14'
        />
      </span>
    </Tooltip>
  )
}
export default MaterialDesktopTooltip
