import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'
import useWindowDimensions from 'helpers/useWindowDimensions'

import styles from './CheckEmail.module.scss'

/* Redux Actions */
import { jobbseekersSocialLoginRequest } from 'store/actions/auth/jobseekersSocialLogin'
import { useFirstRender } from 'helpers/useFirstRender'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

const CheckEmail = ({
  errorText,
  email,
  setEmaile,
  handleSendEmailTOP,
  isLoading,
  router,
  logSuccess
}: any) => {
  const { width } = useWindowDimensions()
  const dispatch = useDispatch()
  const firstRender = useFirstRender()
  const [emailError, setEmailError] = useState(false)
  const [emailBtnDisabled, setEmailBtnDisabled] = useState(true)

  const jobseekersSocialResponse = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.response
  )
  const jobseekersSocialFailed = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.error
  )

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
    const { data } = jobseekersSocialResponse
    if (data?.token) {
      // const url =
      //   data.is_profile_update_required || !data.is_profile_completed
      //     ? '/jobseeker-complete-profile/1'
      //     : redirectPage
      //     ? redirectPage
      //     : `/jobs-hiring/job-search`
      // router.push(url)
      logSuccess(data)
    }
  }, [jobseekersSocialResponse])

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
    const data = {
      ...payload,
      ...router.query,
      email: payload.email ? payload.email : '',
      social_user_token: payload.accessToken,
      social_type: payload.socialType,
      social_user_id: payload.userId,
      source: width > 576 ? 'web' : 'mobile_web'
    }
    dispatch(jobbseekersSocialLoginRequest(data))
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

export default React.memo(CheckEmail)
