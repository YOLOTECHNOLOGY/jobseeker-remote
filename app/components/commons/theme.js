
import { createTheme } from '@mui/material/styles'

export default createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    height: '44px',
                    lineHeight: '16px',
                    borderRadius: '10px',
                    background: '#F0F0F0',//'#E7F1FB' 
                    overflow: 'hidden',
                    color: '#136FD3',
                    '&.MuiSelected': {
                        background: '#E7F1FB',//'#E7F1FB' 
                    },
                    border:'none'
                },
                notchedOutline: {
                    '&.Mui-focused': {
                        border: 'none'
                    },
                    border: 'none',
                }
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '&.MuiOutlinedInput-focused': {
                        backgroundColor: '#E7F1FB'
                    },
                    shrink: {
                        backgroundColor: '#E7F1FB'
                    },
                    focused: {
                        backgroundColor: '#E7F1FB'
                    },
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    backgroundColor: 'default',
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    overflow: 'hidden',
                    // border:'1px solid #ccc',
                    // backgroundColor:'while'
                },

            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    overflow: 'hidden',
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontSize: '13px',
                    letterSpacing: '1px',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    letterSpacing: '1px',
                    height: '44px',
                    lineHeight: '16px',
                },
                shrink: {
                    display: 'none',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    letterSpacing: '1px',
                }
            },
        },

    },
})