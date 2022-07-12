import { useState } from 'react'

import { Menu } from '@mui/material'
import { MoreIcon } from '../../images'

type DropdownProps = {
  children?: any
}

const Dropdown = ({ children }: DropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <div onClick={handleClick}>
        <img src={MoreIcon} width='5' height='20' />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </Menu>
    </div>
  )
}

export default Dropdown
