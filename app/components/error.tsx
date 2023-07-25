'use client' // Error components must be Client components
import { useRouter } from 'next/navigation'
import { BossjobLogo } from 'images'
import { Button } from 'app/components/MUIs'
import styles from '../index.module.scss'
import configuredAxios from 'helpers/configuredAxios'
import { accessToken, getCookie, removeUserCookie, setCookie } from 'helpers/cookies'
import Loading from './loading'

export default function Error(props: { error: any; reset: () => void }) {
  const { error, reset } = props
  const router = useRouter()

  if (error.digest === '193452068') {
    if (globalThis.globalPromise) {
      globalThis.globalPromise.then(() => {
        window.location.reload()
      })
    } else {
      const axios = configuredAxios('auth', '', '', '')
      const refresh = getCookie('refreshToken')
      const data = { source: 'web', refresh }

      function redirectToGetStarted() {
        removeUserCookie()
        router.push('/get-started', { scroll: true })
      }

      if (!refresh) {
        // setTimeout(() => {
        redirectToGetStarted()
        // }, 3000)
        // redirect to login after 3s, so
        return <Loading />
      }
      globalThis.globalPromise = axios
        .post('/token/refresh', data)
        .then((res: any) => {
          const { access, token_expired_at } = res?.data?.data ?? {}
          if (access) {
            setCookie(accessToken, access, token_expired_at)
            window.location.reload()
          } else {
            // refresh token errored, in this case, that means the refreshToken is expired
            // so we should leave and login
            redirectToGetStarted()
          }
        })
        .catch((e) => {
          redirectToGetStarted()
        })
    }
    return <Loading />
  }
  return (
    <section className={styles.errorMain}>
      <div className={styles.errorMain_loadingLogo}>
        <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
      </div>
      <h2>Something went wrong!</h2>
      <Button
        variant='outlined'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        sx={{
          textTransform: 'capitalize',
          marginRight: '15px'
        }}
      >
        Try again
      </Button>
      <Button
        variant='contained'
        onClick={() => router.push('/')}
        sx={{
          textTransform: 'capitalize'
        }}
      >
        Go Home
      </Button>
    </section>
  )
}
