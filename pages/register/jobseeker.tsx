import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useForm } from 'react-hook-form'

/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'
import { registerJobseekerRequest } from 'store/actions/auth/registerJobseeker'
import { registerRecruiterRequest } from 'store/actions/auth/registerRecruiter'

/* Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import SEO from 'components/SEO'
import AuthLayout from 'components/AuthLayout'
import Text from 'components/Text'
import { TextField } from '@mui/material'

import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

/* Styles */
import styles from './Register.module.scss'

const Register = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const isEmployer = router.pathname.includes('/employer')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)

  const [password, setPassword] = useState('')
  const [isSubscribe, setIsSubscribe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)

  const { register, formState: { errors }} = useForm()

  const isRegisteringJobseeker = useSelector((store: any) => store.auth.registerJobseeker.fetching)
  const isRegisteringRecruiter = useSelector((store: any) => store.auth.registerRecruiter.fetching)

  const handleOnShowPassword = () => setShowPassword(!showPassword)

  const handleRegister = () => {
    if (!email) setEmailError('Email Address is required.')
    else if (!/\S+@\S+\.\S+/.test(email)) setEmailError('Email Address is invalid.')
    else setEmailError(null)

    if (!password) setPasswordError('Password is required.')
    else if (password?.length < 8) setPasswordError('Must be 8 characters or more.')
    else if (password?.length > 16) setPasswordError('Must be 16 characters or less.')
    else setPasswordError(null)

    if (!emailError && !passwordError) {
      let redirect: string | string[] = ''
      if (router.query && (router.query.redirectFullPath || router.query.redirect)) {
        redirect = router.query?.redirectFullPath ? router.query.redirectFullPath : router.query.redirect
      }

      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        terms_and_condition: false,
        is_subscribe: isSubscribe
      }

      if (!isEmployer) dispatch(registerJobseekerRequest({ ...payload, jobId: router.query?.jobId || '' }))
      if (isEmployer) dispatch(registerRecruiterRequest({ ...payload, redirect }))
    }
  }

  const errorText = (errorMessage: string) => {
    return <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>{errorMessage}</Text>
  }

  const callbackRequest = (payload) => {
    dispatch(socialLoginRequest(payload))
  }

  return (
    <AuthLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Join Bossjob, <br/>kick-start your career</Text>}
      ctaSignup
      isEmployer={isEmployer}
    >
      <SEO
        title='Jobseeker Register - Bossjob'
        description='Bossjob - Career Platform for Professionals in Philippines'
        canonical='/register/jobseeker'
      />

      <div className={styles.Register}>
        <SocialMediaAuth callbackRequest={callbackRequest} />
        <div className={styles.RegisterDivider}>
          <Text textStyle='lg' className={styles.RegisterDividerText}>
            Or
          </Text>
        </div>

        <form className={styles.RegisterForm}>
          <div className={styles.RegisterFormName}>
            <div>
              <MaterialTextField
                refs={{ ...register('firstName', { required: true }) }}
                className={styles.RegisterFormInput}
                name='firstName'
                label='First Name'
                variant='outlined'
                value={firstName}
                size='small'
                defaultValue={firstName}
                autoComplete='off'
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <Text textColor='red' textStyle='sm'>
                  This field is required.
                </Text>
              )}
            </div>

            <MaterialTextField
              className={styles.RegisterFormInput}
              id='lastName'
              label='Last Name'
              variant='outlined'
              value={lastName}
              size='small'
              defaultValue={lastName}
              autoComplete='off'
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <MaterialTextField
            className={styles.RegisterFormInput}
            id='email'
            label='Email Address'
            variant='outlined'
            value={email}
            size='small'
            defaultValue={email}
            autoComplete='off'
            error={emailError ? true : false}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && errorText(emailError)}

          <TextField
            className={styles.RegisterFormInput}
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            label='Password'
            variant='outlined'
            size='small'
            value={password}
            autoComplete='off'
            error={passwordError ? true : false}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleOnShowPassword}
                    onMouseDown={handleOnShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordError && errorText(passwordError)}

          <div className={styles.RegisterEmailNewsletter}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  value={isSubscribe}
                  onChange={(e) => setIsSubscribe(e.target.checked)}
                />
              }
              label={
                <Text textStyle='sm'>
                  Email me exclusive newsletters & job updates from Bossjob.
                </Text>
              }
            />
          </div>

          <MaterialButton
            capitalize
            size='large'
            variant='contained'
            className={styles.RegisterButton}
            isLoading={isRegisteringJobseeker || isRegisteringRecruiter}
            onClick={() => handleRegister()}
          >
            <Text textStyle='xl' textColor='white' bold>
              Sign up
            </Text>
          </MaterialButton>

          <Text className={styles.RegisterAgreement} textStyle='sm'>
            By signing up, I have read and agreed to Terms of Use and Privacy Policy
          </Text>
        </form>
      </div>
    </AuthLayout>
  )
}

Register.getInitialProps = async ({ req, res }) => {
  const accessToken = req?.cookies.accessToken
  if (accessToken) {
    res.setHeader('location', `/jobs-hiring/job-search`)
    res.statusCode = 301
    res.end()
  }
  return {}
}

export default Register