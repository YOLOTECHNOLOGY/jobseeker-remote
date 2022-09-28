import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

import styles from './CheckEmail.module.scss'

/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'

const CheckEmail = () => {
  const dispatch = useDispatch()
  const [emaile, setEmaile] = useState<string>()
  const [emaileError] = useState()

  const callbackRequest = (payload) => {
    dispatch(socialLoginRequest(payload))
  }

  return (
    <div className={styles.emailLoginContainer}>
      <div className={styles.emailLoginContainer_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          {' '}
          Join Bossjob, <br />
          kick-start your career!
        </Text>
      </div>

      <div className={styles.emailLoginContainer_from}>
        <MaterialTextField
          className={styles.formInput}
          name='Enter your email address'
          // placeholder='Enter your email address'
          label='Enter your email address'
          variant='outlined'
          value={emaile}
          size='small'
          defaultValue={emaile}
          autoComplete='off'
          onChange={(e) => setEmaile(e.target.value)}
          error={emaileError ? true : false}
        />

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          className={styles.formButton}
          // isLoading={isRegisteringJobseeker}
          // onClick={() => {}}
        >
          <Text textStyle='xl' textColor='white' bold>
            Submit
          </Text>
        </MaterialButton>
      </div>

      <div className={styles.emailLoginContainer_tip}>
        <Text className={styles.emailLoginContainer_tip_content}>
          By signing up, I have read and agreed to Terms of Use and Privacy Policy
        </Text>
      </div>

      <div className={styles.emailLoginContainer_quickLogin}>
        <div className={styles.RegisterDivider}>
          <Text textStyle='lg' className={styles.RegisterDividerText}>
            Sign in with
          </Text>
        </div>
        <SocialMediaAuth callbackRequest={callbackRequest} />
      </div>
    </div>
  )
}

export default CheckEmail
