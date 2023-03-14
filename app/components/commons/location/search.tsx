import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import {  TextField } from '@mui/material'

type Input = React.InputHTMLAttributes<HTMLInputElement>
type JobSearchBar = {
  children?: React.ReactNode
  style?: React.CSSProperties
  defaultValue?: string
  value?: string
  className?: string
  label?: string
  size?: 'small' | 'medium'
  variant?: 'outlined' | 'filled' | 'standard'
  isLoading?: boolean
  disabled?: boolean
  color?: string
  options?: any
  refs?: any
  onSelect?: Function
  searchFn?: Function
  updateSearchValue?: Function
  maxLength?: Number
} & Omit<Input, 'size'>

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          overflow: 'hidden',
          // border: '1px solod #ccc'
        },
        // inputRoot:{
        //   border:'none'
        // },
        // focused:{
        //   border:'none'
        // }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          overflow: 'hidden',
          border: 'none',
          focused: {
            border: 'none'
          }
        
        },

      }
    },
  }
})
const MaterialTextFieldWithSuggestionList = ({
  id,
  label,
  variant,
  size,
  color,
  className,
  defaultValue,
  value,
  options,
  onSelect,
  searchFn,
  updateSearchValue,
  maxLength,
  refs,
  ...rest
}: JobSearchBar) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchValue(event.target.value)
    searchFn(event.target.value)
  }

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        id='autocomplete-suggestion-list'
        freeSolo
        // style={{background:'#fff',color:'#ccc'}}
        options={options?.map((option) => option)}
        className={className}
        size={size}
        onChange={(_, val: any, reason) => {
          if ((reason === 'selectOption' || reason === 'clear') && onSelect) {
            onSelect(val ?? '')
          }
        }}
        placeholder={label}

        defaultValue={defaultValue}
        inputValue={value}
        renderInput={(params) => (
          <TextField
            {...refs}
            id={id}
             style={{background:'#fff',color:'#ccc',borderRadius:'10px'}}

            // label={label}
            placeholder={label}
            hiddenLabel
            maxLength={maxLength}
            color={color as any}
            // variant='standard'
            // inputProps={{disableUnderline:true}}
            onChange={handleChange}
            {...rest}
            {...params}
          />
        )}
      />
    </ThemeProvider>
  )
}
export default MaterialTextFieldWithSuggestionList
