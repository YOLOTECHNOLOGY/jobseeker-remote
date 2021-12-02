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
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            fontSize: '13px',
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
        },
      },
    },
  },
})

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList.map((region) => region.locations)
  return locationConfig
}

const MaterialLocationField = ({ id, className, defValue, ...rest }: any) => {
  // const [selectedLocation, setSelectedLocation] = useState(defValue.value)
  const locationList = useSelector(
    (store: any) => store.config.config.response?.inputs.location_lists
  )
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const defaultOption = formattedLocationList.find((v) => defValue.value === v.value)
  // console.log('defaultOption', defaultOption)

  const indexOfDefaultOption =
    formattedLocationList.findIndex((loc) => loc.value === defaultOption?.value) || null

  // console.log('indexOfDefaultOption', indexOfDefaultOption)

  const xyz = Object.assign({}, formattedLocationList[indexOfDefaultOption])
  // console.log('xyz', xyz)

  return (
    <ThemeProvider theme={autocompleteTheme}>
      <Autocomplete
        id='location-autocomplete'
        options={formattedLocationList}
        groupBy={(option: any) => option.region}
        getOptionLabel={(option: any) => option.value || ''}
        size='small'
        className={className}
        renderInput={(params) => (
          <ThemeProvider theme={textFieldTheme}>
            <TextField id='location' label='Location' variant='outlined' size='small' {...params} />
          </ThemeProvider>
        )}
        defaultValue={xyz}
        // inputValue={selectedLocation}
        // onInputChance={(_event, newLocation) => {
        //   setSelectedLocation(newLocation)
        // }}
        {...rest}
      />
    </ThemeProvider>
  )
}
export default MaterialLocationField
