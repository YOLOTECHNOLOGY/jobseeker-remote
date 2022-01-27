import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

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

/* Styles */
import styles from './Login.module.scss'

const Login = () => {  
  const { register, formState: { errors } } = useForm()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const handleOnShowPassword = () => setShowPassword(!showPassword)

  return (
    <AuthLayout 
      headingText='Log in to Bossjob'
      ctaSignup
    >
      <SEO
        title='Login - Bossjob'
        description='Bossjob - Career Platform for Professionals in Philippines'
        canonical='/login'
      />
      <div className={styles.Login}>
        <SocialMediaAuth
          callbackRequest={socialLoginRequest}
        />
        <div className={styles.LoginDivider}>
          <Text textStyle='lg'  className={styles.LoginDividerText}>Or</Text>
        </div>
        <form className={styles.LoginForm}>
          <MaterialTextField 
            refs={{...register('email', { required: true })}} 
            className={styles.LoginFormInput}
            id='email' 
            label='Email Address' 
            variant='outlined'
            size='small'
            value={email}
            autoComplete='off'
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <Text textStyle='sm' textColor='red'>This field is required</Text>}
          
          <MaterialTextField 
            refs={{...register('password', { required: true })}} 
            className={styles.LoginFormInput}
            type={showPassword ? "text" : "password"}
            id='password' 
            label='Password' 
            variant='outlined'
            size='small'
            value={password}
            autoComplete='off'
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleOnShowPassword}
                    onMouseDown={handleOnShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.password && <Text textStyle='sm' textColor='red'>This field is required</Text>}

          <div className={styles.LoginForgotPasswordLink}>
            <Link to={'/'}>
              <Text textStyle='base' textColor='darkgrey'>Forgot Password</Text>
            </Link>
          </div>

          <MaterialButton 
            capitalize 
            size='large' 
            variant='contained'
            className={styles.LoginButton}
          >
            <Text textStyle='xl' textColor='white' bold>Log In</Text>
          </MaterialButton>

          <Text className={styles.LoginAgreement} textStyle='sm'>
            By logging in, I have read and agreed to Terms of Use and Privacy Policy
          </Text>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login