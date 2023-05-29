import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'

import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'
// import useWindowDimensions from 'helpers/useWindowDimensions'

/* Redux Actions */
import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { useFirstRender } from 'helpers/useFirstRender'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import styles from './CheckEmail.module.scss'

const CheckEmail = ({
  errorText,
  email,
  setEmaile,
  handleSendEmailTOP,
  isLoading,
  router,
  lang
}: any) => {
  // const { width } = useWindowDimensions()
  const {
    JoinBossjob,
    kickStartYourCareer,
    enterYourEmailAddress,
    bySigningUp,
    termsOfUse,
    and,
    privacyPolicy,
    signInWith,
    submit,
    pleaseEnterAvalidEmailAddress
  } = lang || {}
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const [emailError, setEmailError] = useState(false)
  const [emailBtnDisabled, setEmailBtnDisabled] = useState(true)

  const jobseekersSocialFailed = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.error
  )

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDownEnter)
    return () => window.removeEventListener('keydown', handleOnKeyDownEnter)
  }, [emailBtnDisabled, handleSendEmailTOP])

  const handleOnKeyDownEnter = (e) => {
    if (e.key === 'Enter' && e.keyCode === 13) {
      if (!emailBtnDisabled) {
        handleSendEmailTOP()
      }
    }
  }

  useEffect(() => {
    // test after delete
    if (jobseekersSocialFailed?.data) {
      const errorMessage = jobseekersSocialFailed?.data.errors?.email[0]
      dispatch(
        displayNotification({
          open: true,
          message: errorMessage,
          severity: 'warning'
        })
      )
    }
  }, [jobseekersSocialFailed])

  useEffect(() => {
    if (firstRender) {
      return
    }

    let errorText = null
    if (!email.length || !/\S+@\S+\.\S+/.test(email)) {
      errorText = pleaseEnterAvalidEmailAddress
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
    const data = {
      ...payload,
      ...router.query,
      // avatar: payload.pictureUrl ? payload.pictureUrl : '',
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: 'web'
    }
    if (payload.pictureUrl) {
      data.avatar = payload.pictureUrl
    }
    dispatch(jobbseekersSocialLoginRequest(data))
  }

  return (
    <div className={styles.emailLoginContainer}>
      <div className={styles.emailLoginContainer_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          {' '}
          {JoinBossjob}, <br />
          {kickStartYourCareer}
        </Text>
      </div>
      <form className={styles.emailLoginContainer_from} autoComplete='on' onSubmit={e => e.stopPropagation()}>
        {/* Don't delete this div, this fixed browser autocomplete email */}
        <div style={{ opacity: 0, height: '1px', overflow: 'hidden', pointerEvents: 'none',zIndex:-1 }} >
          <input type="email" value={email} name='hidden-email' autoComplete="on" />
          <input type="password" value={ email ? ' ': ''} name='hidden-password' autoComplete='on' />
        </div>
        <MaterialTextField
          className={styles.formInput}
          id='username'
          name={'username'}
          label={enterYourEmailAddress}
          variant='outlined'
          value={email}
          size='small'
          autoFocus
          autoComplete='on'
          type='email'
          onChange={(e) => setEmaile(e.target.value)}
          error={emailError ? true : false}
        />
        {emailError && errorText(emailError)}

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          type='submit'
          className={styles.formButton}
          disabled={emailBtnDisabled}
          // isLoading={isRegisteringJobseeker}
          onClick={handleSendEmailTOP}
          isLoading={isLoading}
        >
          <Text textStyle='xl' textColor='white' bold>
           {submit}
          </Text>
        </MaterialButton>

      </form>

      <div className={styles.emailLoginContainer_tip}>
        <Text className={styles.emailLoginContainer_tip_content}>
        {bySigningUp}{' '}
          <Link
            target='_blank'
            href='https://blog.bossjob.ph/terms-and-conditions/'
            //  className={styles.emailLoginContainer_link}
          >
           {termsOfUse}
          </Link>
          &nbsp; {and} &nbsp;
          <Link
            target='_blank'
            href='https://blog.bossjob.ph/terms-and-conditions/'
            //  className={styles.emailLoginContainer_link}
          >
          {privacyPolicy}
          </Link>
        </Text>
      </div>

      <div className={styles.emailLoginContainer_quickLogin}>
        <div className={styles.RegisterDivider}>
          <Text textStyle='lg' className={styles.RegisterDividerText}>
           {signInWith}
          </Text>
        </div>
        <SocialMediaAuth callbackRequest={callbackRequest} />
      </div>
    </div>
  )
}

export default React.memo(CheckEmail)
