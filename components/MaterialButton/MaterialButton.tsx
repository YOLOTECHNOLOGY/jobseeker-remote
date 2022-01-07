import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

interface MaterialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  variant?: 'text' | 'contained' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  capitalize?: boolean
  isLoading?: boolean
  disabled?: boolean
}

const MaterialButton = ({
  variant,
  size,
  className,
  children,
  disabled,
  isLoading,
  capitalize,
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
        <LoadingButton variant={variant} size={size} className={className} loading={isLoading}>
          {children}
        </LoadingButton>
      ) : (
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={disabled}
          style={{textTransform: !capitalize ? 'uppercase' : 'capitalize'}}
          {...(rest as any)}
        >
          {children}
        </Button>
      )}
    </ThemeProvider>
  )
}
export default MaterialButton