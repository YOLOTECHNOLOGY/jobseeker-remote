
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
                    background: '#F0F0F0', // '#E7F1FB' 
                    overflow: 'hidden',
                    color: '#136FD3',
                    '&.MuiSelected': {
                        background: '#E7F1FB', // '#E7F1FB' 
                    },
                    border: 'none',
                    padding: '0px',
                    '&.Mui-focused': {
                        background: '#F0F0F0', // '#E7F1FB' 
                    }
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
                    '&.Mui-focused': {
                        backgroundColor: '#E7F1FB',
                        '&.MuiInputLabel': {
                            display: 'none'
                        }
                    },
                    // focused: {
                    //     backgroundColor: '#E7F1FB',
                    //     '&.MuiInputLabel': {
                    //         display: 'none'
                    //     }
                    // },
                },
                select: {
                    focused: {
                        background: '#F0F0F0'
                    },
                    padding: '0px'
                },
                // focused: {
                //     background: '#F0F0F0'
                // }
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
        // MuiTypography: {
        //     styleOverrides: {
        //         root: {
        //             fontSize: '13px',
        //             letterSpacing: '1px',
        //         },
        //     },
        // },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    display: 'none',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    // height: '100%',
                    lineHeight: '16px',
                    overflow: 'visible'
                },
                shrink: {
                    display: 'none'
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    letterSpacing: '1px',
                    padding: '0px'
                }
            },
        },

    },
})