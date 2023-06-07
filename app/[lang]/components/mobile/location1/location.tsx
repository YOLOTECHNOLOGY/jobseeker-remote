import React from 'react'
// import React, { useState } from 'react'

/* Material */
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

/* Helpers */
// import { formatLocationConfig } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

const textFieldTheme = (value, height = '44px', width = '90vw') => createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          width: width,
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
const MaterialLocationField = ({ className, label, locationList, width, disableClearable = false, defaultValue, required, fieldRef, error, value, height, ...rest }: any) => {

  const formattedLocationList = flat(formatLocationConfig(locationList))
  return (
    <ThemeProvider theme={textFieldTheme(value, height, width)}>
      <Autocomplete
        id='location-autocomplete'
        options={formattedLocationList}
        groupBy={(option: any) => option.region_display_name}
        getOptionLabel={(option: any) => option.value || ''}
        size='small'
        value={value}
        disableClearable={disableClearable}
        className={className}
        classes={{}}
        onChange={rest?.onChange}
        renderInput={(params) => {
          return (
            <TextField
              id='location12'
              {...fieldRef}
              error={!!error}
              style={{ height: '100%' }}
              required={rest.required}
              helperText={error?.message}
              label={<span>{label ? label : 'Location'} {required ? <span style={{ color: 'red' }}>{' *'}</span> : ''}</span>}
              variant='outlined'
              size='small'
              {...params}
              inputProps={{ ...params?.inputProps, value: value?.value ?? '' }}
            />
          )
        }}
        defaultValue={defaultValue}
        {...rest}
      />
    </ThemeProvider>
  )
}
export default MaterialLocationField
