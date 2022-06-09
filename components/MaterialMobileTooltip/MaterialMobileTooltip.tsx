import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'

interface MaterialMobileTooltipProps {
  icon: string
  className: string
  title: string
  placement?: any
}

const MaterialMobileTooltip = ({
  icon,
  className,
  title,
  placement='top'
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
    >
      <span className={className}>
        <img 
          src={icon} 
          alt='icon' 
          width='24'
          height='24'
          onClick={() => {
            setOpenTooltip(!openTooltip)
          }}
        />
      </span>
    </Tooltip>
  )
}
export default MaterialMobileTooltip
