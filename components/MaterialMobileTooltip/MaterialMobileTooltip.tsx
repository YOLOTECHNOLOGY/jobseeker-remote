import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'

interface MaterialMobileTooltipProps {
  icon: string
  className: string
  title: string
  placement?: any
  style?:any
}

const MaterialMobileTooltip = ({
  icon,
  className,
  title,
  placement='top',
  ...rest
}: MaterialMobileTooltipProps) => {
  const [openTooltip, setOpenTooltip] = useState(false)
  
  return (
    <Tooltip 
      title={title}
      placement={placement}
      arrow
      disableFocusListener
      disableTouchListener
      open={openTooltip}
      {...rest}
    >
      <span className={className}>
        <img 
          src={icon} 
          alt='icon' 
          width='14'
          height='14'
          onClick={() => {
            setOpenTooltip(!openTooltip)
          }}
        />
      </span>
    </Tooltip>
  )
}
export default MaterialMobileTooltip
