import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
// import { inputLabelClasses } from "@material-ui/core/InputLabel";
// import { styled } from "@material-ui/core/styles"

interface MaterialTextFieldProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  label?: string
  size?: 'small' | 'medium'
  variant?: 'outlined' | 'filled' | 'standard'
  isLoading?: boolean
  disabled?: boolean
}

const theme = createTheme({
  components: {
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     input: {
    //       fontSize: '14px',
    //     },
    //   },
    // },
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
const MaterialTextField = ({ id, label, variant, size, className, ...rest } : MaterialTextFieldProps) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField id={id} label={label} variant={variant} size={size} className={className} {...rest}/>
    </ThemeProvider>
  )
}
export default MaterialTextField
