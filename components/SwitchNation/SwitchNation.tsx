'use client'
import { useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { isEqual } from 'lodash-es'
import Modal from '@mui/material/Modal'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'

import { getCountryKey, getLang, languages, nations } from 'helpers/country'
import { accessToken as accessTokenKey, configKey, getCookie, setCookie } from 'helpers/cookies'

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

type propsType = {
  open: boolean
  close: () => void
  save?: () => void
}

const SwitchNation = ({ close, open }: propsType) => {
  const [nation, setNation] = useState(() => ({ lang: getLang(), country: getCountryKey() }))
  const [loading, setLoading] = useState(false)
  const originalSetting = useMemo(() => {
    return {
      country: getCountryKey(),
      lang: getLang()
    }
  }, [open])
  const handleSwitchNation = () => {
    const { country, lang } = nation
    setLoading(true)
    const isProduction = process.env.ENV === 'production'
    const accessToken = getCookie(accessTokenKey)

    // todo: if we just modify the language, in this case, we can refresh browser with it's own path, that's should be better

    let query = ''
    let { origin } = window.location
    if (isProduction) {
      origin = origin.slice(0, origin.lastIndexOf('.') + 1)
      query = country ?? nation?.country
    } else {
      // origin is localhost:3000
    }
    query += `/${lang}`
    // && isProduction
    if (accessToken) {
      query += '/changeLocale?accessToken=' + accessToken
    }
    // store this in cookies. then the others link request server can take it to server
    setCookie(configKey, `${country}_${lang}`)
    console.log('origin + query', origin + query)
    window.location.href = origin + query
  }

  const handleSelectNation = (event: any, newValue: typeof nations[0]) => {
    setNation((preState) => ({ ...preState, country: newValue.value }))
  }

  return (
    <Modal
      open={open}
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
              disableClearable
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
              value={nations.find((item) => item.value === nation.country).label}
            />
          </ThemeProvider>

          <ThemeProvider theme={autocompleteTheme}>
            <Autocomplete
              disableClearable
              disablePortal
              value={languages.find((item) => item.value === nation.lang).label}
              options={languages}
              onChange={(event, item: typeof languages[0]) => {
                setNation((preState) => ({ ...preState, lang: item?.value }))
              }}
              renderInput={(params) => (
                <ThemeProvider theme={textFieldTheme}>
                  <TextField {...params} label='Language' />
                </ThemeProvider>
              )}
              sx={{ flex: 1 }}
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
            onClick={handleSwitchNation}
            disabled={isEqual(nation, originalSetting)}
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
