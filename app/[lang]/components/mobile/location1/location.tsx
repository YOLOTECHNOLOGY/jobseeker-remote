import React from 'react'
// import React, { useState } from 'react'

/* Material */
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

/* Helpers */
// import { formatLocationConfig } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

const textFieldTheme = (value, height = '44px') => createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          width: '90vw',
          height: '100%',
          padding: '0px',
          top: '0px',
          left: '0px'
        },

      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          overflow: 'hidden',
          // border:'1px solid #ccc',
          // backgroundColor:'while'
          paddingTop: '0px',
          height,
        },
        input: {
          paddingTop: '0px'
        }
      }
    },
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
          marginTop: '0px',
          paddingTop: '0px',
          fontSize: '14px'
        },

        // input: {
        //   color: '#136FD3',
        // },
        // focused: {
        //   background: '#E7F1FB'
        // },
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
          top: '-8px',
          height: height,
          lineHeight: height,
          paddingTop: '0px'
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

const MaterialLocationField = ({ className, label, locationList, disableClearable = false, defaultValue, required, fieldRef, error, value, height, ...rest }: any) => {

  const formattedLocationList = flat(formatLocationConfig(locationList))
  return (
    <ThemeProvider theme={textFieldTheme(value, height)}>
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
            style={{ height: '100%' }}
            required={rest.required}
            helperText={error?.message}
            label={<span>{label ? label : 'Location'} {required ? <span style={{ color: 'red' }}>{' *'}</span> : ''}</span>}
            variant='outlined'
            size='small'
            {...params}
          />
        )}
        defaultValue={defaultValue}
        {...rest}
      />
    </ThemeProvider>
  )
}
export default MaterialLocationField
