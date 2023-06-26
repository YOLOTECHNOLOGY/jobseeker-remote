import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'


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
  renderOption?:any
} & Omit<Input, 'size'>

const theme = parent => createTheme(({
  ...parent,
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        ...parent?.components?.MuiAutocomplete?.styleOverrides,
        root: {
          ...parent?.components?.MuiAutocomplete?.styleOverrides?.root,
          // borderRadius: '10px',
          // overflow: 'hidden',
          // "&:Mui-focused":{
          //   background:'none',
          //   border:'none'
          // },
          height: '100%',
          border: 'none',
          overflow: 'visible'
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
          },
          "&:Mui-focused": {
            background: 'none',
            border: 'none',
            OutlinedFlag: false
          },
          notchedOutline: {
            border: 'none'
          }
        },

      }
    },
    MuiInputLabel:{
      styleOverrides: {
        root: {
          fontSize: '14px',
        }
      }
    }
  }
}))
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
  isLoading,
  onSelect,
  searchFn,
  updateSearchValue,
  maxLength,
  refs,
  renderOption,
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
        options={options?.map((option) => option)}
        getOptionLabel={(option: any) => option.value || option}
        className={className}
        size={size}
        loading={isLoading}
        onInputChange={(_, val: any, reason) => {
          if ((reason === 'clear') && onSelect) {
            onSelect(val ?? '')
          }
        }}

        onChange={(_, val: any, reason) => {
          if ((reason === 'selectOption' || reason === 'clear') && onSelect) {
            onSelect(val ?? '')
          }
        }}
        renderOption={renderOption}
        disableClearable={false}
        placeholder={label}
        defaultValue={defaultValue}
        inputValue={value}
        renderInput={(params) => (
          <TextField
            {...refs}
            id={id}
            classes={{}}
            value={value}
            hiddenLabel
            enterKeyHint='search'
            maxLength={maxLength}
            label={label}
            color={color as any}
            onFocus={handleChange}
            onChange={handleChange}
            {...rest}
            {...params}
            inputProps={{ ...(params as any).inputProps, enterKeyHint: 'search' }}
          />
        )}
      />
    </ThemeProvider>
  )
}
export default MaterialTextFieldWithSuggestionList
