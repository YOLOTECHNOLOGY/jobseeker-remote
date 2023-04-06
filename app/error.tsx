'use client' // Error components must be Client components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BossjobLogo } from 'images'
import { Button } from 'app/components/MUIs'
import styles from './index.module.scss'

export default function Error({ error, reset }: { error: any; reset: () => void }) {
  const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
  useEffect(() => {
    if (error.message === 'NEXT_REDIRECT') {
      const redirectUrl = error.digest?.split?.(';')?.[1]
      if (redirectUrl) {
        router.push(redirectUrl, { forceOptimisticNavigation: true })
      }
    }
    if (error?.response?.status === 401) {
      router.push('/get-started', { forceOptimisticNavigation: true })
    }
}, [error])
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
