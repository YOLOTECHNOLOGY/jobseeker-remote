'use client' // Error components must be Client components
import { useRouter } from 'next/navigation'
import { BossjobLogo } from 'images'
import { Button } from 'app/[lang]/components/MUIs'
import styles from './index.module.scss'
import configuredAxios from 'helpers/configuredAxios'
import { getCookie, setCookie } from 'helpers/cookies'
import Loading from './loading'

export default function Error(props: { error: any; reset: () => void }) {
  const { error, reset } = props
  const router = useRouter()
  
  if (error?.message?.includes('status code 401') || error.digest === '193452068' || error.digest === '2228123006') {
    if (globalThis.globalPromise) {
      globalThis.globalPromise.then(() => {
        window.location.reload()
      })
    } else {
      const axios = configuredAxios('auth', '', '', '');
      const data = { source: 'web', refresh: getCookie('refreshToken') }
      globalThis.globalPromise = axios.post('/token/refresh', data).then((res: any) => {
        const { access, token_expired_at } = res?.data?.data ?? {}
        if (access) {
          setCookie('accessToken', access, token_expired_at)
          window.location.reload()

        } else {
          router.push('/get-started', { forceOptimisticNavigation: true })
        }
      }).catch((e) => {
        router.push('/get-started', { forceOptimisticNavigation: true })
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
