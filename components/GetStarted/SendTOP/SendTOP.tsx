import Text from 'components/Text'

import styles from './SendTOP.module.scss'

const SendTOP = () => {
  return (
    <div className={styles.SendTOPContainer}>
      <div className={styles.SendTOPContainer_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          Sign up an account 🎉
        </Text>
      </div>

      <div className={styles.SendTOPContainer_desc}>
        <Text tagName='p' textStyle='lg'>
          Please enter the 6-digit one-time password that we sent to boss@gmail.com.
        </Text>
      </div>
    </div>
  )
}

export default SendTOP
