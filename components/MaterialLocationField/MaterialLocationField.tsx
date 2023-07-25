import React from 'react'
// import React, { useState } from 'react'
import { useSelector } from 'react-redux'

/* Material */
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import styles from 'styles/maintenance.module.scss';

/* Helpers */
// import { formatLocationConfig } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

const textFieldTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // fontSize: '14px',
          letterSpacing: '1px',
          backgroundColor: 'white',
          height: '44px'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          letterSpacing: '1px',
          transform: 'translate(14px, 10px) scale(1)',
          '&.Mui-focused': {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)'
          },
          top: '4px',
          height: '44px',
          lineHeight: '18px'
        },
        shrink: {
          fontSize: '10px',
          transform: 'translate(14px, -10px) scale(1)'
        },
        outlined: {
          '&.MuiInputLabel-shrink': {
            fontSize: '10px'
          }
        }
      }
    }
  }
})
const autocompleteTheme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '&.MuiInputLabel-shrink': {
            fontSize: '13px'
          },
          height: '44px'
        }
      }
    }
  }
})

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList?.map((region) => region.locations)
  return locationConfig
}

const MaterialLocationField = ({
  className,
  label,
  disableClearable = false,
  defaultValue,
  required,
  fieldRef,
  error,
  hiddenLabel,
  ...rest
}: any) => {
  // const [selectedLocation, setSelectedLocation] = useState(defValue.value)
  const locationList = useSelector((store: any) => store.config.config.response?.location_lists)
  const formattedLocationList = flat(formatLocationConfig(locationList))
  return (
    <ThemeProvider theme={autocompleteTheme}>
      {/* <head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
      </head> */}
      <Autocomplete
        id='location-autocomplete'
        options={formattedLocationList}
        groupBy={(option: any) => option.region_display_name}
        getOptionLabel={(option: any) => option.value || ''}
        size='small'
        disableClearable={disableClearable}
        className={className}
        renderInput={(params) => (
          <ThemeProvider theme={textFieldTheme}>
            <TextField
              id='location'
              {...fieldRef}
              error={!!error}
              required={rest.required}
              helperText={error?.message}
              label={
                <span>
                  {label ? label : 'Location'}{' '}
                  {required ? <span style={{ color: 'red' }}>{' *'}</span> : ''}
                </span> 
              }
              variant='outlined'
              size='small'
              className={hiddenLabel ? styles.hiddenLabel : ''}
              {...params}
            />
          </ThemeProvider>
        )}
        defaultValue={defaultValue}
        {...rest}
      />
    </ThemeProvider>
  )
}
export default MaterialLocationField
