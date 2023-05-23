/* eslint-disable valid-jsdoc */
import React from 'react'
import Text from 'components/Text'
import { Button } from '@mui/material'

import styles from './MagicLink.module.scss'
import { useRouter } from 'next/router'
import { formatTemplateString } from 'helpers/formatter'
/**
 *we should passing the getStatred transitions to this component
 */
const MagicLink = ({ userId, email, lang }: any) => {
  const { magicLink } = lang
  const router = useRouter()
  const backToPage = () => {
    router.push('/')
  }

  return (
    <div className={styles.MagicLink}>
      <div className={styles.MagicLink_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          {userId ? magicLink.welcomeBack + ' 👏' : magicLink.signUp + ' 🎉'}
        </Text>
      </div>

      <div className={styles.MagicLink_desc}>
        <Text tagName='p' textStyle='lg' className={styles.MagicLink_desc_text}>
          {formatTemplateString(magicLink.haveSendEmail, email)}
        </Text>
        <Button variant='contained' className={styles.MagicLink_desc_btn} onClick={backToPage}>
          {magicLink.toHome}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(MagicLink)
