import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const MaterialBasicSelect = ({
  id,
  label,
  options,
  className,
  onSelect,
  onOpen,
  greyBg,
  defaultValue,
  fieldRef,
  disabled,
  ...rest
}: any) => {
  const [value, setValue] = useState(defaultValue || '')

  useEffect(()=>{
    setValue(defaultValue)
  },[defaultValue])

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string)
    if (onSelect) {
      onSelect(event.target.value)
    }
  }
  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            transform: 'translate(14px, 10px) scale(1)',
            letterSpacing: '1px',
            '&.Mui-focused': {
              fontSize: '10px',
              transform: 'translate(14px, -10px) scale(1)',
            },
          },
          shrink: {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)',
          },
          outlined: {
            '&.MuiInputLabel-shrink': {
              fontSize: '10px',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: greyBg ? '#E2E2E2' : 'white',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontSize: '14px',
            letterSpacing: '1px',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '13px',
            letterSpacing: '1px',
            padding:'10px 16px'
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
          {...fieldRef}
          labelId={`${id}-select-label`}
          id={id}
          value={value}
          label={label}
          onChange={handleChange}
          onOpen={onOpen}
          disabled={disabled}
          {...rest}
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
