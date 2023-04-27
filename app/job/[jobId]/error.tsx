'use client' // Error components must be Client components
import { useRouter } from 'next/navigation'
import { BossjobLogo } from 'images'

import { Button } from 'app/components/MUIs'

import styles from './page.module.scss'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()
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
