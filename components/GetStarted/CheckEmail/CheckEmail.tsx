import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

import styles from './CheckEmail.module.scss'

/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'
import { useFirstRender } from 'helpers/useFirstRender'

const CheckEmail = ({ errorText, email, setEmaile, handleSendEmailTOP, isLoading }: any) => {
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const [emailError, setEmailError] = useState(false)
  const [emailBtnDisabled, setEmailBtnDisabled] = useState(true)

  useEffect(() => {
    if (firstRender) {
      return
    }

    let errorText = null
    if (!email.length || !/\S+@\S+\.\S+/.test(email)) {
      errorText = 'Please enter a valid email address.'
    }
    setEmailError(errorText)
  }, [email])

  useEffect(() => {
    if (firstRender) {
      return
    }

    if (emailError) {
      setEmailBtnDisabled(true)
    } else {
      setEmailBtnDisabled(false)
    }
  }, [emailError])

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
          value={email}
          size='small'
          autoComplete='off'
          onChange={(e) => setEmaile(e.target.value)}
          error={emailError ? true : false}
        />
        {emailError && errorText(emailError)}

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          className={styles.formButton}
          disabled={emailBtnDisabled}
          // isLoading={isRegisteringJobseeker}
          onClick={handleSendEmailTOP}
          isLoading={isLoading}
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
