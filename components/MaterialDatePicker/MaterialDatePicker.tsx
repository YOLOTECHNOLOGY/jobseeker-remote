import React, { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/lab'
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { TextField } from '@mui/material'
import styles from 'styles/maintenance.module.scss'

interface MaterialDatePickerProps {
  value?: any
  onDateChange?: Function
  label?: string
  inputFormat?: string
  views?: any
  fullWidth?: boolean
  refs?: any
  hiddenLabel?: boolean
}

const MaterialDatePicker = ({
  value,
  onDateChange,
  label,
  inputFormat,
  views,
  fullWidth,
  refs,
  hiddenLabel
}: MaterialDatePickerProps) => {

  const [focus, setFocus] = useState(false);
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
      {/* <head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
      </head> */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
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
              aria-readonly
              {...params}
              error={false}
              fullWidth={fullWidth}
              className={hiddenLabel ? styles.hiddenLabel : ''}
            />
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  )
}
export default MaterialDatePicker
