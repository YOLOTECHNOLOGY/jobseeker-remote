import React, { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
// import { inputLabelClasses } from "@material-ui/core/InputLabel";
// import { styled } from "@material-ui/core/styles"

type Input = React.InputHTMLAttributes<HTMLInputElement>
type MaterialTextFieldProps = {
  children?: React.ReactNode
  style?: React.CSSProperties
  defaultValue?: string
  className?: string
  label?: string |  React.ReactNode
  size?: 'small' | 'medium'
  variant?: 'outlined' | 'filled' | 'standard'
  isLoading?: boolean
  disabled?: boolean
  color?: string
  error?: any
  InputProps?: any
  refs?: any
  multiline?: boolean
  rows?: Number
  fullWidth?: boolean
  maxLength?: Number
  isSubmitOnEnter?: boolean
  onSubmit?: any
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '44px',
          fontSize: '16px',
          backgroundColor: "white"
        }
      }
    }
  },
})
const MaterialTextField = ({ id, label, variant, error, refs, size, color, className, defaultValue, multiline=false, rows=1, maxLength=255, isSubmitOnEnter, onSubmit, ...rest} : MaterialTextFieldProps) => {
  const [value, setValue] = useState(defaultValue)

  useEffect(()=>{
    setValue(defaultValue)
  },[defaultValue])
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <ThemeProvider theme={theme}>
      <TextField
        onKeyDown={isSubmitOnEnter ? (event)=>{
          if (event.key == 'Enter') onSubmit();
        }: null} 
        {...refs}
        id={id} 
        label={label} 
        color={color as any} 
        value={value} 
        onChange={handleChange} 
        variant={variant as any} 
        size={size} 
        className={className} 
        error={error}
        multiline={multiline}
        rows={rows}
        {...rest}
        inputProps={{
          maxLength,
          ...rest['inputProps']
        }}
      />
    </ThemeProvider>
  )
}
export default MaterialTextField
