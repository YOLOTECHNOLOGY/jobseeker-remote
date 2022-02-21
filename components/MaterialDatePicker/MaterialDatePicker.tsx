import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { TextField } from '@mui/material'

interface MaterialDatePickerProps {
  value?: any,
  onChange?: Function,
  label?: string,
  inputFormat?: string,
  views?:any
}

const MaterialDatePicker = ({
  value,
  onChange,
  label,
  inputFormat,
  views,
  ...rest
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
              // transform: 'translate(14px, -10px) scale(1)',
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
          views={views}
          label={label}
          inputFormat={inputFormat || ''}
          value={value}
          onChange={() => onChange}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </LocalizationProvider>
    </ThemeProvider>
  )
}
export default MaterialDatePicker