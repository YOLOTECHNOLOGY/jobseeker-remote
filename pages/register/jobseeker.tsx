import React, { useState, useEffect } from 'react'
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

/* Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import SEO from 'components/SEO'
import AuthLayout from 'components/AuthLayout'
import Text from 'components/Text'
import { TextField } from '@mui/material'
import NotificationBar from 'components/NotificationBar'

import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

/* Styles */
import styles from './Register.module.scss'
import MetaText from '../../components/MetaText'

const Register = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [firstName, setFirstName] = useState('')
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastName, setLastName] = useState('')
  const [lastNameError, setLastNameError] = useState(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)

  const [password, setPassword] = useState('')
  const [isSubscribe, setIsSubscribe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)

  const {
    register,
    formState: { errors },
  } = useForm()

  const isRegisteringJobseeker = useSelector((store: any) => store.auth.registerJobseeker.fetching)

  const registerJobseekerState = useSelector((store: any) => store.auth.registerJobseeker)

  const handleOnShowPassword = () => setShowPassword(!showPassword)

  useEffect(() => {
    if (firstName) {
      setFirstNameError(null)
    }
  }, [firstName])

  useEffect(() => {
    if (lastName) {
      setLastNameError(null)
    }
  }, [lastName])

  useEffect(() => {
    let emailErrorMessage = null

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      emailErrorMessage = 'Please enter a valid email address.'
    }

    setEmailError(emailErrorMessage)

  }, [email])

  useEffect(() => {
    let passwordErrorMessage = null

    if (password?.length > 0 && password?.length < 8) {
      passwordErrorMessage = 'Please enter your password (minimum 8 characters).'
    } else if (password?.length > 255) {
      passwordErrorMessage = 'Please enter a shorter password (maximum of 255 characters)'
    } else {
      passwordErrorMessage = null
    }
    setPasswordError(passwordErrorMessage)
  }, [password])

  useEffect(() => {
    if (registerJobseekerState.error === 'The email has already been taken.') {
      setEmailError(<p>A user with this email address already exists. Please enter a different email address or <a href='/login/jobseeker' style={{ color: '#2379ea', textDecoration: 'underline' }}>log in</a>.</p>)
    }
  
  }, [registerJobseekerState])

  const handleRegister = () => {
    if (!firstName) {
      setFirstNameError('Please enter your first name.')
    }

    if (!lastName) {
      setLastNameError('Please enter your last name.')
    }

    if (!email) {
      setEmailError('Please enter your email address.')
    }

    if (!password) {
      setPasswordError('Please enter your password (minimum 8 characters).')
    }

    if (firstName && lastName && email && password && !firstNameError && !lastNameError && !emailError && !passwordError) {
      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        terms_and_condition: false,
        is_subscribe: isSubscribe,
      }

      dispatch(registerJobseekerRequest({ ...payload, jobId: router.query?.jobId || '' }))
    }
  }

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  const callbackRequest = (payload) => {
    dispatch(socialLoginRequest(payload))
  }

  return (
    <AuthLayout
      headingText={
        <>
          <MetaText tagName='h1'>Sign up as Jobseeker</MetaText>
          <Text bold textStyle='xxxl' tagName='h2'>
            {' '}
            Join Bossjob, <br />
            kick-start your career
          </Text>
        </>
      }
      ctaSignup
    >
      <SEO
        title='Sign Up | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/register/jobseeker'
      />

      <NotificationBar />

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
                error={firstNameError ? true : false}
              />
              {firstNameError && errorText(firstNameError)}
              {errors.firstName && (
                <Text textColor='red' textStyle='sm'>
                  This field is required.
                </Text>
              )}
            </div>

            <div>
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
                error={lastNameError ? true : false}
              />
              {lastNameError && errorText(lastNameError)}
            </div>
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
            isLoading={isRegisteringJobseeker}
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
