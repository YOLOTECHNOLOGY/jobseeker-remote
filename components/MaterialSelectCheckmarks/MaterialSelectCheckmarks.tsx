import React, { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import OutlinedInput from '@mui/material/OutlinedInput'

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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    // On autofill we get a the stringified value.
    const formattedValue = typeof value === 'string' ? value.split(',') : value
    setSelectedOptions(
     formattedValue
    )
    if (onSelect){
      onSelect(formattedValue)
    }
  }
  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: greyBg ? '#BCBCBC' : '',
            opacity:'40%'
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
  console.log('selectedOptions', selectedOptions)
  return (
    <ThemeProvider theme={theme}>
      <FormControl className={className} size='small'>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-select-label`}
          id={id}
          multiple
          value={selectedOptions}
          label={label}
          onChange={handleChange}
          input={<OutlinedInput label='Tag' />}
          renderValue={(selected) => selected.join(', ')}
          // MenuProps={MenuProps}
        >
          {options &&
            options.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={selectedOptions.indexOf(option) > -1} size='small' />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}
export default MaterialSelectCheckmarks
