import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { CircularProgress } from '@mui/material'
interface MaterialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  component?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  variant?: 'text' | 'contained' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  capitalize?: boolean
  isLoading?: boolean
  disabled?: boolean
  sx?: any
}

const MaterialButton = ({
  variant,
  size,
  className,
  children,
  disabled,
  isLoading,
  capitalize,
  component,
  sx,
  ...rest
}: MaterialButtonProps) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2379EA',
      },
      secondary: {
        main: '#FFFFFF',
        dark: '#FFFFFF',
        contrastText: '#2379EA',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            lineHeight: '16px',
          },
        },
      },
    },
  })
  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <LoadingButton
          variant={variant}
          size={size}
          className={className}
          loading={isLoading}
          style={{ textTransform: !capitalize ? 'uppercase' : 'capitalize' }}
          sx={sx ? sx : { height: '44px' }}
          loadingIndicator={<CircularProgress color={variant === 'outlined' ? 'primary' : 'secondary'} size={16} />}
        >
          {/* {children} */}
        </LoadingButton>
      ) : (
        <Button
          component={component}
          variant={variant}
          size={size}
          className={className}
          disabled={disabled}
          style={{ textTransform: !capitalize ? 'uppercase' : 'capitalize', height: '44px' }}
          {...(rest as any)}
        >
          {children}
        </Button>
      )}
    </ThemeProvider>
  )
}
export default MaterialButton
