import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

interface MaterialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  variant?: 'text' | 'contained' | 'outlined'
  isLoading?: boolean
  disabled?: boolean
}
const MaterialButton = ({
  variant,
  className,
  children,
  disabled,
  isLoading,
  ...rest
}: MaterialButtonProps) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2379EA',
      },
    },
    components: {
      MuiButton: {
         styleOverrides: {
          root: {
            fontSize: '13px',
          },
        }
      },
    },
  })
  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <LoadingButton variant={variant} className={className} loading={isLoading}>
          {children}
        </LoadingButton>
      ) : (
        <Button variant={variant} className={className} disabled={disabled} {...rest}>
          {children}
        </Button>
      )}
    </ThemeProvider>
  )
}
export default MaterialButton