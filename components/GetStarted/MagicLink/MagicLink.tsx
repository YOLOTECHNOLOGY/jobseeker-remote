import Text from 'components/Text'
import { Button } from '@mui/material'

import styles from './MagicLink.module.scss'

const MagicLink = () => {
  return (
    <div className={styles.MagicLink}>
      <div className={styles.MagicLink_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          Sign up an account 🎉
        </Text>
      </div>

      <div className={styles.MagicLink_desc}>
        <Text tagName='p' textStyle='lg' className={styles.MagicLink_desc_text}>
          We’ve sent a magic link to boss@gmail.com. Please click on the link to proceed.
        </Text>
        <Button variant='contained' className={styles.MagicLink_desc_btn}>
          Back to home page
        </Button>
      </div>
    </div>
  )
}

export default MagicLink
