import React from 'react'
import Text from 'components/Text'
import { Button } from '@mui/material'

import styles from './MagicLink.module.scss'
import { useRouter } from 'next/router'

const MagicLink = ({ userId, email }: any) => {
  const router = useRouter()
  const backToPage = () => {
    router.push('/')
  }

  return (
    <div className={styles.MagicLink}>
      <div className={styles.MagicLink_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          {userId ? 'Welcome back! 👏' : 'Sign up an account 🎉'}
        </Text>
      </div>

      <div className={styles.MagicLink_desc}>
        <Text tagName='p' textStyle='lg' className={styles.MagicLink_desc_text}>
          We’ve sent a magic link to {email}. Please click on the link to proceed.
        </Text>
        <Button variant='contained' className={styles.MagicLink_desc_btn} onClick={backToPage}>
          Back to home page
        </Button>
      </div>
    </div>
  )
}

export default React.memo(MagicLink)
