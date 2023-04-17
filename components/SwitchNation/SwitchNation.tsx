'use client'
import { useState } from 'react'

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
  { value: 'ph', label: 'PH' },
  { value: 'sg', label: 'SGP' }
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

  const handleSwitchNation = () => {
    setLoading(true)
    const countryKey = getCountryKey()
    const accessToken = getCookie('accessToken')

    if (nation.value === countryKey) {
      close()
      return
    }

    let url: string
    if (accessToken) {
      url = 'https://dev.bossjob.' + nation.value + '/changeLocale?accessToken=' + accessToken
    } else {
      url = 'https://dev.bossjob.' + nation.value
    }

    window.location.href = url
  }

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <div className={styles.swtihcNation}>
        <div className={styles.swtihcNation_head}>
          <p>Which country and language would you like to browse Bossjob in?</p>
          <CloseIcon
            sx={{ color: '#BCBCBC', fontSize: '26px', cursor: 'pointer' }}
            onClick={close}
          />
        </div>

        <main className={styles.swtihcNation_main}>
          <ThemeProvider theme={autocompleteTheme}>
            <Autocomplete
              disablePortal
              options={nations}
              onChange={(event: any, newValue: any | null) => {
                setNation(newValue)
              }}
              renderInput={(params) => (
                <ThemeProvider theme={textFieldTheme}>
                  <TextField {...params} label='Country' />
                </ThemeProvider>
              )}
              sx={{ flex: 1, marginRight: '16px' }}
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
            onClick={save ? save : handleSwitchNation}
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
