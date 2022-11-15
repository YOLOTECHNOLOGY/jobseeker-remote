import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { FormHelperText } from '@mui/material'

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
  required,
  error,
  ...rest
}: any) => {
  const [value, setValue] = useState(defaultValue || '')

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

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
            lineHeight: '26px'
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
            fontSize: '14px',
            height: '44px',
            backgroundColor: greyBg ? '#E2E2E2' : 'white',
            lineHeight: '16px',
            alignItems: 'self-end'
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
            fontSize: '16px',
            letterSpacing: '1px',
            padding: '10px 16px'
          },
        },
      },
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <FormControl className={className} size='small' required={required} error={!!error}>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
          {...fieldRef}
          labelId={`${id}-select-label`}
          id={id}
          value={value}
          label={label}
          required={required}
          onChange={handleChange}
          onOpen={onOpen}
          disabled={disabled}
          helperText={error?.message}
          {...rest}

        >
          {options &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>{error?.message}</FormHelperText>
      </FormControl>
    </ThemeProvider>
  )
}
export default MaterialBasicSelect
