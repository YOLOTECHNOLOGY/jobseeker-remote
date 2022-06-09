import React from 'react'
// import React, { useState } from 'react'
import { useSelector } from 'react-redux'

/* Material */
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

/* Helpers */
// import { formatLocationConfig } from 'helpers/jobPayloadFormatter'
import { flat } from 'helpers/formatter'

const textFieldTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          letterSpacing: '1px',
          backgroundColor: 'white',
          height: '44px'
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          letterSpacing: '1px',
          transform: 'translate(14px, 10px) scale(1)',
          '&.Mui-focused': {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)',
          },
          top: '4px',
          lineHeight: '16px'
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
  },
})
const autocompleteTheme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '&.MuiInputLabel-shrink': {
            fontSize: '13px',
          },
          height: '44px'
        },
      },
    },
  },
})

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList?.map((region) => region.locations)
  return locationConfig
}

const MaterialLocationField = ({ className, label, defaultValue, fieldRef, error, ...rest }: any) => {
  // const [selectedLocation, setSelectedLocation] = useState(defValue.value)
  const locationList = useSelector(
    (store: any) => store.config.config.response?.inputs?.location_lists
  )
  const formattedLocationList = flat(formatLocationConfig(locationList))
  return (
    <ThemeProvider theme={autocompleteTheme}>
      <Autocomplete
        id='location-autocomplete'
        options={formattedLocationList}
        groupBy={(option: any) => option.region_display_name}
        getOptionLabel={(option: any) => option.value || ''}
        size='small'
        className={className}
        renderInput={(params) => (
          <ThemeProvider theme={textFieldTheme}>
            <TextField id='location' {...fieldRef} error={error} label={label ? label : 'Location'} variant='outlined' size='small' {...params} />
          </ThemeProvider>
        )}
        defaultValue={defaultValue}
        {...rest}
      />
    </ThemeProvider>
  )
}
export default MaterialLocationField
