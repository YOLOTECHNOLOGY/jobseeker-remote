import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from '@mui/material/Link'
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
  const formRef = useRef(null)

  const jobseekersSocialFailed = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.error
  )

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDownEnter)
    return () => window.removeEventListener('keydown', handleOnKeyDownEnter)
  }, [emailBtnDisabled, handleSendEmailTOP])

  const handleOnKeyDownEnter = (e) => {
    if (e.key === 'Enter' && e.keyCode === 13) {
      if (!emailBtnDisabled && formRef.current) {
        formRef.current.onsubmit()
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
    const validEmailReg = /^[\w-\\.]+@([\w-]+\.)+[\w-]{1,9}$/i
    if (!email.length || !validEmailReg.test(email)) {
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
      <form className={styles.emailLoginContainer_from} autoComplete='on' onSubmit={e => e.preventDefault()}>
        {/* Don't delete this div, this fixed safari/firefox browser autocomplete email */}
        <div style={{ opacity: 0, height: '1px', overflow: 'hidden', pointerEvents: 'none' }}>
          <input
            type="email"
            value={email}
            name="email-hidden"
            hidden
            autoComplete="on"
          />
          <input
            type="password"
            value={(email || '').trim() ? ' ' : ''}
            name="hidden-password"
            autoComplete="on"
          />
        </div>
        <MaterialTextField
          className={styles.formInput}
          name={'email'}
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
          className={styles.formButton}
          disabled={emailBtnDisabled}
          // isLoading={isRegisteringJobseeker}
          // onClick={handleSendEmailTOP}
          isLoading={isLoading}
        >
          {/* fixed firefox browser autocomplete */}
          <input type="submit" value={submit} disabled={emailBtnDisabled} onClick={handleSendEmailTOP} className={styles.submitButton} />
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
