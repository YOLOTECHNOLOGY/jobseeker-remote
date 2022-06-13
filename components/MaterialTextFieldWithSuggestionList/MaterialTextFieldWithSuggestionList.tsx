import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import MaterialTextField from 'components/MaterialTextField'

type Input = React.InputHTMLAttributes<HTMLInputElement>
type MaterialTextFieldWithSuggestionListProps = {
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
          lineHeight: '18px'
        },
        shrink: {
          fontSize: '10px',
          transform: 'translate(14px, -10px) scale(1)',
        },
        outlined: {
          '&.MuiInputLabel-shrink': {
            fontSize: '10px',
          },
          fontSize: '14px',
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
  value,
  options,
  onSelect,
  searchFn,
  updateSearchValue,
  refs,
  ...rest
}: MaterialTextFieldWithSuggestionListProps) => {
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
        className={className}
        size={size}
        onChange={(_, val:any, reason)=>{
          if ((reason === 'selectOption' || reason === 'clear') && onSelect) {
            onSelect(val ?? '')
          }
        }}
        defaultValue={defaultValue}
        value={value}
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
