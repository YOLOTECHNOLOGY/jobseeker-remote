import React, { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// }

interface MaterialSelectCheckMarksProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  label?: string
  options?: Array<OptionType>
  onSelect?: Function
  greyBg?: boolean
}

interface OptionType {
  value: any
  label: string | boolean
}


const MaterialSelectCheckmarks = ({
  id,
  label,
  options,
  className,
  onSelect,
  greyBg,
}: MaterialSelectCheckMarksProps) => {
  const [value, setValue] = useState<string[]>([])
  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    setValue(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
    if (onSelect){
      onSelect()
    }
  }
  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: greyBg ? '#BCBCBC' : '',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            backgroundColor: 'default',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: '13px',
          },
        },
      },
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <FormControl className={className} size='small'>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-select-label`}
          id={id}
          multiple
          value={value}
          label={label}
          onChange={handleChange}
          // MenuProps={MenuProps}
        >
          {options &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={value.indexOf(option) > -1} size='small' />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}
export default MaterialSelectCheckmarks
