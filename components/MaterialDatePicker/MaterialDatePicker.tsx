import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { TextField } from '@mui/material'

interface MaterialDatePickerProps {
  value?: any
  onDateChange?: Function
  label?: string
  inputFormat?: string
  views?: any
  fullWidth?: boolean
  refs?: any
}

const MaterialDatePicker = ({
  value,
  onDateChange,
  label,
  inputFormat,
  views,
  fullWidth,
  refs,
}: MaterialDatePickerProps) => {
  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            transform: 'translate(14px, 10px) scale(1)',
            letterSpacing: '1px',
            '&.Mui-focused': {
              fontSize: '10px'
            }
          },
          shrink: {
            fontSize: '10px',
            transform: 'translate(12px, -8px) scale(1)'
          },
          outlined: {
            '&.MuiInputLabel-shrink': {
              fontSize: '10px'
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            backgroundColor: 'white'
          },
          input: {
            padding: '10.5px 14px'
          }
        }
      }
    }
  })
  return (
    <ThemeProvider theme={theme}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
      </head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          {...refs}
          disableMaskedInput={true}
          views={views}
          label={label}
          inputFormat={inputFormat || ''}
          maxDate={new Date()}
          minDate={new Date('1942-01-01')}
          value={value}
          onChange={(date) => {
            if (onDateChange) {
              onDateChange(date)
            }
          }}
          renderInput={(params) => (
            <TextField
              error={true}
              aria-readonly
              {...params}
              fullWidth={fullWidth}
              helperText={null}
            />
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  )
}
export default MaterialDatePicker
