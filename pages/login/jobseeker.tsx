import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

/* Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import SEO from 'components/SEO'
import AuthLayout from 'components/AuthLayout'
import Text from 'components/Text'
import Link from 'components/Link'
import NotificationBar from 'components/NotificationBar'

import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'
import { loginRequest } from 'store/actions/auth/login'

/* Styles */
import styles from './Login.module.scss'

const LoginJobseeker = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [login, setLogin] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const [generalError, setGeneralError] = useState(null)

  const isLoginFetching = useSelector((store: any) => store.auth.login.fetching)
  const loginError = useSelector((store: any) => store.auth.login.error)

  const handleOnShowPassword = () => setShowPassword(!showPassword)

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  useEffect(() => {
    if (login) {
      setEmailError(null)
    }
  }, [login])

  useEffect(() => {
    if (password) {
      setPasswordError(null)
    }
  }, [password])

  useEffect(() => {
    if (isLoginFetching === false) {
      if (loginError === 'invalid credential') {
        setGeneralError(<p>Sorry, either the email or password is wrong. Please try again or reset them <a href='/reset-password' style={{ color: '#2379ea', textDecoration: 'underline' }}>here</a>.</p>)
      } else if (loginError === 'account suspended') {
        setGeneralError(<p>Your account has been suspended. Please contact support@bossjob.com for clarification.</p>)
      }
    }
  
  }, [isLoginFetching])

  const handleLogin = () => {
    setGeneralError(null)

    if (!login) {
      setEmailError('Please enter your email address.')
    }

    if (!password) {
      setPasswordError('Please enter your password.')
    }

    if (login && password) {
      let redirect: string | string[] = ''
      if (router.query && (router.query.redirectFullPath || router.query.redirect)) {
        redirect = router.query?.redirectFullPath
          ? router.query.redirectFullPath
          : router.query.redirect
      }

      const loginPayload = {
        login,
        password,
        redirect,
      }
  
      dispatch(loginRequest(loginPayload))
    }

  }

  const callbackRequest = (payload) => {
    dispatch(socialLoginRequest(payload))
  }

  return (
    <AuthLayout
      headingText={
        <>
          <Text bold textStyle='xxxl' tagName='h1'>
            Log in to Bossjob
          </Text>
        </>
      }
      ctaSignup
      isLogin
    >
      <SEO
        title='Log In or Sign Up | Bossjob'
        description='Log in to Bossjob to get connected with professional job opportunities and quality talents. If you are not a member yet, Register for free now to Apply for Jobs, Create Professional Resume and Get Headhunted on Bossjob!'
        canonical='/login/jobseeker'
      />

      <NotificationBar />

      <div className={styles.Login}>
        <SocialMediaAuth callbackRequest={callbackRequest} />
        <div className={styles.LoginDivider}>
          <Text textStyle='lg' className={styles.LoginDividerText}>
            Or
          </Text>
        </div>

        <form className={styles.LoginForm}>
          {generalError && errorText(generalError)}

          <MaterialTextField
            className={styles.LoginFormInput}
            id='email'
            label='Email Address'
            variant='outlined'
            value={login}
            size='small'
            defaultValue={login}
            autoComplete='off'
            onChange={(e) => setLogin(e.target.value)}
          />
          {emailError && errorText(emailError)}

          <MaterialTextField
            className={styles.LoginFormInput}
            type={showPassword ? 'text' : 'password'}
            id='password'
            label='Password'
            variant='outlined'
            value={password}
            size='small'
            defaultValue={password}
            autoComplete='off'
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

          <div className={styles.LoginForgotPasswordLink}>
            <Link to={'/reset-password'}>
              <Text textStyle='base' textColor='darkgrey'>
                Forgot Password
              </Text>
            </Link>
          </div>

          <MaterialButton
            capitalize
            size='large'
            variant='contained'
            className={styles.LoginButton}
            isLoading={isLoginFetching}
            onClick={() => handleLogin()}
          >
            <Text textStyle='xl' textColor='white' bold>
              Log In
            </Text>
          </MaterialButton>

          <Text className={styles.LoginAgreement} textStyle='sm'>
            By logging in, I have read and agreed to Terms of Use and Privacy Policy
          </Text>
        </form>
      </div>
    </AuthLayout>
  )
}

export async function getServerSideProps({ req, res, query }) {
  const accessToken = req?.cookies.accessToken

  if (accessToken) {
    let redirectUrl = '/jobs-hiring/job-search'
    const queryRedirect = query?.redirect

    if (queryRedirect) {
      let reqUrl = req?.url
      reqUrl = reqUrl.split('/login/jobseeker?redirect=').pop()
      if (reqUrl) {
        redirectUrl = reqUrl
      }
    }

    res.statusCode = 302
    res.setHeader('location', redirectUrl)
    res.end()
  }

  return {props: {}}
}

export default LoginJobseeker
