'use client'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'

import Modal from '@mui/material/Modal'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'

import { getCountryKey } from 'helpers/country'
import { getCookie } from 'helpers/cookies'

import MaterialButton from 'components/MaterialButton'

import styles from './SwitchNation.module.scss'

const textFieldTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // fontSize: '14px',
          letterSpacing: '1px',
          backgroundColor: 'white',
          height: '44px',
          borderRadius: '10px',

          '& .MuiAutocomplete-input': {
            padding: '4px 4px 7.5px 6px !important'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          letterSpacing: '1px',
          transform: 'translate(14px, 10px) scale(1)',
          '&.Mui-focused': {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)'
          },
          top: '4px',
          height: '44px',
          lineHeight: '18px'
        },
        shrink: {
          fontSize: '10px',
          transform: 'translate(14px, -10px) scale(1)'
        },
        outlined: {
          '&.MuiInputLabel-shrink': {
            fontSize: '10px'
          }
        }
      }
    }
  }
})

const autocompleteTheme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '&.MuiInputLabel-shrink': {
            fontSize: '13px'
          },
          height: '44px'
        }
      }
    }
  }
})

const nations = [
  { value: 'ph', label: 'Philippines' },
  { value: 'sg', label: 'Singapore' }
]

const languages = [{ value: 'english', label: 'English' }]

type propsType = {
  open: boolean
  close: () => void
  save?: () => void
}

const SwitchNation = ({ open, close, save }: propsType) => {
  const [nation, setNation] = useState<any>()
  const [nationDefault] = useState<string>(() => getCountryKey())
  const [loading, setLoading] = useState<boolean>(false)

  const handleSwitchNation = (value?) => {
    setLoading(true)
    const countryKey = getCountryKey()
    const accessToken = getCookie('accessToken')

    if (nation?.value === countryKey || value === countryKey) {
      close()
      return
    }

    let url: string
    let query: string
    if (accessToken) {
      query = value ? value : nation?.value + '/changeLocale?accessToken=' + accessToken
      url = 'https://dev.bossjob.' + query
    } else {
      query = value ? value : nation?.value
      url = 'https://dev.bossjob.' + query
    }

    window.location.href = url
  }

  const handleSelectNation = (event: any, newValue: any | null) => {
    // if (isMobile) {
    //   handleSwitchNation(newValue.value)
    // } else {
    //   setNation(newValue)
    // }
    setNation(newValue)
  }

  return (
    <Modal
      // open={open}
      open={false}
      onClose={close}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      hideBackdrop={isMobile ? true : false}
    >
      <div className={styles.swtihcNation}>
        <div className={styles.swtihcNation_head}>
          <p>Which country and language would you like to browse Bossjob in?</p>
          <CloseIcon
            sx={{ color: '#BCBCBC', fontSize: '26px', cursor: 'pointer' }}
            onClick={close}
            className={styles.swtihcNation_head_close}
          />
        </div>

        <main className={styles.swtihcNation_main}>
          <ThemeProvider theme={autocompleteTheme}>
            <Autocomplete
              disablePortal
              options={nations}
              onChange={handleSelectNation}
              renderInput={(params) => (
                <ThemeProvider theme={textFieldTheme}>
                  <TextField {...params} label='Country' />
                </ThemeProvider>
              )}
              sx={{
                flex: 1,
                marginRight: isMobile ? 0 : '16px',
                marginBottom: isMobile ? '16px' : 0
              }}
              disabled
              defaultValue={nations.find((nation) => nation.value == nationDefault)}
            />
          </ThemeProvider>

          <ThemeProvider theme={autocompleteTheme}>
            <Autocomplete
              disablePortal
              options={languages}
              renderInput={(params) => (
                <ThemeProvider theme={textFieldTheme}>
                  <TextField {...params} label='Language' />
                </ThemeProvider>
              )}
              sx={{ flex: 1 }}
              disabled
              defaultValue={languages[0]}
            />
          </ThemeProvider>
        </main>

        <footer className={styles.swtihcNation_footer}>
          <Button className={styles.swtihcNation_footer_btn} variant='outlined' onClick={close}>
            Close
          </Button>
          <MaterialButton
            className={styles.swtihcNation_footer_btn}
            variant='contained'
            onClick={() => (save ? save : handleSwitchNation())}
            disabled={!nation}
            isLoading={loading}
          >
            Save
          </MaterialButton>
        </footer>
      </div>
    </Modal>
  )
}

export default SwitchNation
