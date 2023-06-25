'use client'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { Stack } from 'app/[lang]/components/MUIs'

import MaterialButton from 'components/MaterialButton'

import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import { LoginModalContext } from 'app/[lang]/components/providers/loginModalProvider'

import styles from '../../../page.module.scss'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'

type propsType = {
  jobId: number
  job_url: string
}

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          transform: 'translate(14px, 10px) scale(1)',
          letterSpacing: '1px',
          '&.Mui-focused': {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)'
          },
          top: '4px',
          lineHeight: '16px'
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
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '44px',
          fontSize: '16px',
          backgroundColor: 'white',
          borderRadius: '10px',
          '>.MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent'
          }
        }
      }
    }
  }
})

const SignUp = ({ jobId, job_url }: propsType) => {
  const dispatch = useDispatch()
  const {
    jobDetail: {
      aside: { signUp }
    }
  } = useContext(languageContext) as any
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const { setShowLogin } = useContext(LoginModalContext)
  const handleSendEmailTOP = () => {
    sessionStorage.setItem('redirectPage',window?.location?.pathname)
    setShowLogin?.(true)
    return 
    setLoading(true)
    authenticationSendEmaillOtp({ email })
      .then(({ status }) => {
        if (status === 200) {
          router.push('/get-started?setp=2&&email=' + email + '&&redirect=' + job_url)
        }
      })
      // .catch((error) => {
      //   dispatch(
      //     displayNotification({
      //       open: true,
      //       message: error.message ?? 'Send EmailOTP fail',
      //       severity: 'error'
      //     })
      //   )
      // })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <section className={styles.signUp}>
      <h3>{signUp.title}</h3>
      <div>
        <Stack spacing={2}>
          {/* <ThemeProvider theme={theme}>
            <TextField
              label={signUp.label}
              size='small'
              onChange={(e) => setEmail(e.target?.value)}
              onKeyUp={(e) => {
                if (e.code == 'Enter') {
                  if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)) {
                    handleSendEmailTOP()
                  }
                }
              }}
            />
          </ThemeProvider> */}

          <MaterialButton
            variant='contained'
            sx={{
              height: '44px',
              background: '#136FD3',
              borderRadius: '10px',
              marginTop: '8px',
              textTransform: 'capitalize !important'
            }}
            isLoading={loading}
           // disabled={! /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)}
            onClick={handleSendEmailTOP}
          >
            {signUp.btn}
          </MaterialButton>
        </Stack>
      </div>

      <p className={styles.signUp_userProtocol}>
        {signUp.note}{' '}
        <a href='https://blog.bossjob.ph/terms-and-conditions/' target='_blank' rel='noreferrer'>
          {signUp.term}
        </a>{' '}
        &nbsp; & &nbsp;
        <a href='https://blog.bossjob.ph/terms-and-conditions/' target='_blank' rel='noreferrer'>
          {signUp.policy}
        </a>
      </p>
    </section>
  )
}

export default SignUp
