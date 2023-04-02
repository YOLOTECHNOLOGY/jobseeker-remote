import React from 'react'
// import React, { useState } from 'react'

/* Material */
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

/* Helpers */
// import { formatLocationConfig } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

const textFieldTheme = (value, height, labelTop = '4px') => createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // fontSize: '14px',
          letterSpacing: '1px',
          borderRadius: '10px',
          backgroundColor: 'white',
          border: 'none',
          height: height,
          background: !!value ? '#E7F1FB' : '#F0F0F0',
          color: '#136FD3',
        },
        notchedOutline: {
          '&.Mui-focused': {
            border: 'none'
          },
          border: 'none',
        }
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          letterSpacing: '1px',
          top: labelTop,
          height: height,
          lineHeight: '18px'
        },
        shrink: {
          display: 'none',
        },
        outlined: {
          '&.MuiInputLabel-shrink': {
            fontSize: '10px',
          },
        },
      },
    },
  },
})

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList?.map((region) => region.locations)
  return locationConfig
}

const MaterialLocationField = ({ className, height = '44px',labelTop, label, locationList, disableClearable = false, defaultValue, required, fieldRef, error, value, ...rest }: any) => {
  const formattedLocationList = flat(formatLocationConfig(locationList))
  return (
    <ThemeProvider theme={textFieldTheme(value, height,labelTop)}>
      <Autocomplete
        id='location-autocomplete'
        options={formattedLocationList}
        groupBy={(option: any) => option.region_display_name}
        getOptionLabel={(option: any) => option.value || ''}
        size='small'

        disableClearable={disableClearable}
        className={className}
        classes={{}}
        renderInput={(params) => (
          <TextField id='location'
            {...fieldRef}
            error={!!error}

            required={rest.required}
            helperText={error?.message}
            label={<span>{label ? label : 'Location'} {required ? <span style={{ color: 'red' }}>{' *'}</span> : ''}</span>} variant='outlined' size='small' {...params} />
        )}
        defaultValue={defaultValue}
        {...rest}
      />
    </ThemeProvider>
  )
}
export default MaterialLocationField
