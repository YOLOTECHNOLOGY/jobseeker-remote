'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

import { Stack } from 'app/components/MUIs'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'

import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import styles from '../../../page.module.scss'

type propsType = {
  jobId: number
}

const SignUp = ({ jobId }: propsType) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')

  const handleSendEmailTOP = () => {
    setLoading(true)
    authenticationSendEmaillOtp({ email })
      .then(({ status }) => {
        if (status === 200) {
          router.push('/get-started?setp=2&&email=' + email + '&&redirect=/job-detail/' + jobId)
        }
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ?? 'Send EmailOTP fail',
            severity: 'error'
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <section className={styles.signUp}>
      <h3>Join Bossjob</h3>
      <div>
        <Stack spacing={2}>
          <MaterialTextField
            label='Email address'
            size='small'
            onChange={(e) => setEmail(e.target?.value)}
          />
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
            onClick={handleSendEmailTOP}
          >
            Sign up
          </MaterialButton>
        </Stack>
      </div>
      <p className={styles.signUp_userProtocol}>
        By signing up, I have read and agreed to the <a href=''>Terms of Use</a> &
        <a href=''>Privacy Policy</a>
      </p>
    </section>
  )
}

export default SignUp
