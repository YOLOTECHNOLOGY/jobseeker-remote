'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import styles from '../../page.module.scss'

const Error = ({ jobDetail }: any) => {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }, [])

  return <div className={styles.invalidLink}>{jobDetail?.message}</div>
}

export default Error
