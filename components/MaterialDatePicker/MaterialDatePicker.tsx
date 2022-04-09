import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { TextField } from '@mui/material'

interface MaterialDatePickerProps {
  value?: any,
  onDateChange: Function,
  label?: string,
  inputFormat?: string,
  views?: any,
  isYear?: boolean
}

const MaterialDatePicker = ({
  value,
  onDateChange,
  label,
  inputFormat,
  views,
  isYear
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
              fontSize: '10px',
            },
          },
          shrink: {
            fontSize: '10px',
            transform: 'translate(12px, -8px) scale(1)',
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
            backgroundColor: "white"
          },
          input: {
            padding: '10.5px 14px',
          }
        },
      }
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          disableMaskedInput={true}
          views={views}
          label={label}
          inputFormat={inputFormat || ''}
          minDate={new Date('1942-01-01')}
          value={value}
          onChange={(date) => onDateChange(date)}
          renderInput={(params) => <TextField error={true} aria-readonly {...params} helperText={null} />}
          maxDate={ isYear ? new Date() : null}
        />
      </LocalizationProvider>
    </ThemeProvider>
  )
}
export default MaterialDatePicker