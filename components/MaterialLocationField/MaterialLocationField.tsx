import React from 'react'
import { useSelector } from 'react-redux'

/* Material */
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

/* Helpers */
// import { formatLocationConfig } from 'helpers/jobPayloadFormatter'

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
  const locationConfig = locationList.map((region) => region.locations).flat(2)
  return locationConfig
}

const MaterialLocationField = ({ id, className }: any) => {
  console.log('id', id)
  // console.log('options', options)

    const options = top100Films.map((option) => {
      const firstLetter = option.title[0].toUpperCase()
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
        ...option,
      }
    })
  console.log('optionasadsd', options)
  console.log(
    'optionasadsadasdasdadd',
    options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))
  )
  const locationList = useSelector((store: any) => store.config.config.response?.inputs.location_lists)
  const formattedLocationList = formatLocationConfig(locationList)
  console.log('MaterialLocationField locationList', locationList)
  console.log('formattedLocationList', formattedLocationList)
  return (
    <ThemeProvider theme={autocompleteTheme}>
      <Autocomplete
        id='location-autocomplete'
        options={formattedLocationList}
        groupBy={(option :any) => option.region}
        getOptionLabel={(option :any) => option.value}
        size='small'
        className={className}
        renderInput={(params) => (
          <ThemeProvider theme={textFieldTheme}>
            <TextField id='location' label='Location' variant='outlined' size='small' {...params} />
          </ThemeProvider>
        )}
      />
    </ThemeProvider>
  )
}
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },

]
export default MaterialLocationField
