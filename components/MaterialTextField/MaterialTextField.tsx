import React, { useEffect, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
// import { inputLabelClasses } from "@material-ui/core/InputLabel";
// import { styled } from "@material-ui/core/styles"

interface MaterialTextFieldProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  style?: React.CSSProperties
  defaultValue?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  label?: string
  size?: 'small' | 'medium'
  variant?: 'outlined' | 'filled' | 'standard'
  isLoading?: boolean
  disabled?: boolean
}

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
const MaterialTextField = ({ id, label, variant, size, className, defaultValue, ...rest } : MaterialTextFieldProps) => {
  const [value, setValue] = useState(defaultValue)

  useEffect(()=>{
    setValue(defaultValue)
  },[defaultValue])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <ThemeProvider theme={theme}>
      <TextField id={id} label={label} value={value} onChange={handleChange} variant={variant} size={size} className={className} {...rest as any}/>
    </ThemeProvider>
  )
}
export default MaterialTextField
