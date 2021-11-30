import React, { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const MaterialBasicSelect = ({ id, label, options, className, onSelect, greyBg, defaultValue }: any) => {
  const [value, setValue] = useState(defaultValue || '')
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string)
    if (onSelect) {
      onSelect(event.target.value)
    }
  }
  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: greyBg ? '#E2E2E2' : '',
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
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}
export default MaterialBasicSelect
