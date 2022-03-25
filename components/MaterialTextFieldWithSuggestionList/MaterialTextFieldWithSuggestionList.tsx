import React, { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import MaterialTextField from 'components/MaterialTextField'

type Input = React.InputHTMLAttributes<HTMLInputElement>
type MaterialTextFieldWithSuggestionListProps = {
  children?: React.ReactNode
  style?: React.CSSProperties
  defaultValue?: string
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
} & Omit<Input, 'size'>

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          transform: 'translate(14px, 10px) scale(1)',
          letterSpacing: '1px',
          '&.Mui-focused': {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)',
          },
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
const MaterialTextFieldWithSuggestionList = ({
  id,
  label,
  variant,
  size,
  color,
  className,
  defaultValue,
  options,
  onSelect,
  searchFn,
  refs,
  ...rest
}: MaterialTextFieldWithSuggestionListProps) => {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    searchFn(event.target.value)
  }

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        id='autocomplete-suggestion-list'
        freeSolo
        options={options?.map((option) => option)}
        className={className}
        size={size}
        onChange={(_, val, reason)=>{
          if (reason === 'selectOption' && onSelect) {
            onSelect(val)
          } 
        }}
        defaultValue={value}
        renderInput={(params) => (
          <MaterialTextField
            {...refs}
            id={id}
            label={label}
            color={color as any}
            variant={variant as any}
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
