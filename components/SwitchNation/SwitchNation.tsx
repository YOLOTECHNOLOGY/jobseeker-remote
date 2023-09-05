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
import { useSearchParams } from 'next/navigation'
import { getCountryKey, getLang, languages, nations } from 'helpers/country'
import {
  accessToken as accessTokenKey,
  configKey,
  getCookie,
  setCookie,
  removeCookie,
  refreshToken as refreshTokenKey,
  userKey,
  redirectUrl
} from 'helpers/cookies'

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
  lang: any
}
const isLocalDev = (url: string) => {
  return url?.includes('localhost') || url.includes('127.0.0.1')
}

const SwitchNation = ({ close, open, lang }: propsType) => {
  const [nation, setNation] = useState(() => ({ lang: getLang(), country: getCountryKey() }))
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')

  const originalSetting = useMemo(() => {
    return {
      country: getCountryKey(),
      lang: getLang()
    }
  }, [open])
  const { switchCountry } = lang || { switchCountry: {} }

  const handleSwitchNation = () => {
    const { country, lang } = nation
    removeCookie('location')
    setLoading(true)
    const { origin, port, hostname, pathname } = window.location
    const isLocal = isLocalDev(hostname)
    const accessToken = getCookie(accessTokenKey)
    const refreshToken = getCookie(refreshTokenKey)
    const user = getCookie(userKey)


    let query = `/${lang}`
    let newOrigin = origin

    // const referralCodeParams = referralCode && `&referral_code=${referralCode}`
    // const invitedSourceParams = invitedSource && `invited_source=${invitedSource}`

    if (!isLocal) {
      newOrigin = origin.slice(0, origin.lastIndexOf('.') + 1) + country + (port ? `:${port}` : '')
    }
    if (origin.includes(newOrigin)) {
      // only language changed
      // the pathname is likely "/en-US/get-started"
      let restPath = pathname.split('/').slice(2).join('/')
      restPath = restPath ? `/${restPath}` : ''
      // store this in cookies. then the others link request server can take it to server
      setCookie(configKey, `${country}_${lang}`)
      window.location.href = newOrigin + query + restPath + location.search
      return
    }

    if (!isLocal && accessToken) {
      query +=
        `/changeLocale?${accessTokenKey}=` +
        accessToken +
        `&country=${country}` +
        `&${refreshTokenKey}=${refreshToken}` +
        `&${userKey}=${JSON.stringify(user)}` +
        `&${redirectUrl}=${pathname.split('/').slice(2).join('/')}`
      query += referralCode ? `&referral_code=${referralCode}` : ''
      query += invitedSource ? `invited_source=${invitedSource}` : ''

    } else {
      query += '/' + pathname.split('/').slice(2).join('/')

    }

    window.location.href = newOrigin + query


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
          <p>{switchCountry?.title}</p>
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
                  <TextField {...params} label={switchCountry.country} />
                </ThemeProvider>
              )}
              sx={{
                flex: 1,
                marginRight: isMobile ? 0 : '16px',
                marginBottom: isMobile ? '16px' : 0
              }}
              value={nations.find((item) => item.value === nation.country)}
            />
          </ThemeProvider>

          <ThemeProvider theme={autocompleteTheme}>
            <Autocomplete
              disableClearable
              disablePortal
              value={languages.find((item) => item.value === nation.lang)}
              options={languages}
              onChange={(event, item: typeof languages[0]) => {
                setNation((preState) => ({ ...preState, lang: item?.value }))
              }}
              renderInput={(params) => (
                <ThemeProvider theme={textFieldTheme}>
                  <TextField {...params} label={switchCountry.lang} />
                </ThemeProvider>
              )}
              sx={{ flex: 1 }}
            />
          </ThemeProvider>
        </main>

        <footer className={styles.swtihcNation_footer}>
          <Button className={styles.swtihcNation_footer_btn} variant='outlined' onClick={close}>
            {switchCountry?.btn1}
          </Button>
          <MaterialButton
            className={styles.swtihcNation_footer_btn}
            variant='contained'
            onClick={handleSwitchNation}
            disabled={isEqual(nation, originalSetting)}
            isLoading={loading}
          >
            {switchCountry?.btn2}
          </MaterialButton>
        </footer>
      </div>
    </Modal>
  )
}

export default SwitchNation
