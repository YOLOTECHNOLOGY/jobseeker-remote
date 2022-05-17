import React, { useState } from 'react'
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

import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'
import { loginRequest } from 'store/actions/auth/login'

/* Styles */
import styles from './Login.module.scss'
import MetaText from '../../components/MetaText'

const LoginJobseeker = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isLoginFetching = useSelector((store: any) => store.auth.login.fetching)

  const handleOnShowPassword = () => setShowPassword(!showPassword)

  const handleLogin = () => {
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
      applyJobExternalRedirect: '',
    }

    dispatch(loginRequest(loginPayload))
  }

  const callbackRequest = (payload) => {
    dispatch(socialLoginRequest(payload))
  }

  return (
    <AuthLayout
      headingText={
        <>
          <MetaText tagName='h1'>Log in to Bossjob</MetaText>
          <Text bold textStyle='xxxl' tagName='h2'>
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
      <div className={styles.Login}>
        <SocialMediaAuth callbackRequest={callbackRequest} />
        <div className={styles.LoginDivider}>
          <Text textStyle='lg' className={styles.LoginDividerText}>
            Or
          </Text>
        </div>

        <form className={styles.LoginForm}>
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
            type='submit'
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

LoginJobseeker.getInitialProps = async ({ req, res }) => {
  const accessToken = req?.cookies.accessToken
  if (accessToken) {
    res.setHeader('location', `/jobs-hiring/job-search`)
    res.statusCode = 301
    res.end()
  }
  return {}
}

export default LoginJobseeker
