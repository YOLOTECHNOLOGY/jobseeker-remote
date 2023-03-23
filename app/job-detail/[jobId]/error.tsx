'use client' // Error components must be Client components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from 'app/components/MUIs'

import styles from './page.module.scss'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <section className={styles.errorMain}>
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
