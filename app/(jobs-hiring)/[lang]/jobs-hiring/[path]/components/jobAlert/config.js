import { createTheme } from '@mui/material/styles'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'

export const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          '&.MuiDialog-root': {
            '& .MuiPaper-root': {
              borderRadius: '12px',
              width: '540px',
              padding: '32px 40px'
            }
          }
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          '&.MuiDialogTitle-root': {
            color: '#1D2129',
            fontSize: '32px',
            fontWeight: 700,
            padding: '0px'
          }
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          '&.MuiDialogContent-root': {
            padding: '0px'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            top: 0,
            legend: {
              display: 'none'
            }
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#4E5969',
          fontSize: '24px'
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: 0
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '24px 0 0 0',
          borderTop: '1px solid #E5E6EB'
        }
      }
    }
  }
})

export const validEmailReg = /^[\w-\\.]+@([\w-]+\.)+[\w-]{1,9}$/i