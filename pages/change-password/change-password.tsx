import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import { useForm } from 'react-hook-form'

/* Redux Actions */
import { resetPasswordRequest } from 'store/actions/auth/resetPassword'

/* Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import SEO from 'components/SEO'
import AuthLayout from 'components/AuthLayout'
import Text from 'components/Text'
import { TextField } from '@mui/material'

/* Styles */
import styles from './ChangePassword.module.scss'

const ChangePassword = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { login, otp } = router.query
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordMatch, setIsPasswordMatch] = useState(false)

  const { register, handleSubmit, formState: { errors }} = useForm()

  const isResettingPassword = useSelector((store: any) => store.auth.resetPassword.fetching)

  useEffect(() => {
    if (confirmPassword) setIsPasswordMatch(confirmPassword === password)
  }, [confirmPassword])

  const handleTogglePasswordVisibility = (field) => {
    if (field === 'password') return setShowPassword(!showPassword)
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleResetPassword = (data) => {
    dispatch(resetPasswordRequest({ login, otp, password: data.password}))
  }

  const handleDisplayErrors = (field) => {
    switch(field?.type) {
      case 'required':
        return errorText('This field is required.')
      case 'minLength':
        return errorText('Must be 8 characters or more.')
      case 'maxLength':
        return errorText('Must be 16 characters or less.')
      default:
        return errorText('')
    }
  }

  const errorText = (text) => {
    return <Text textStyle='sm' textColor='red'>{text}</Text>
  }

  return (
    <AuthLayout 
      headingText='Update Password'
      ctaSignup
      isBackToLogin
    >
      <SEO
        title='Change Password - Bossjob'
        description='Bossjob - Career Platform for Professionals in Philippines'
        canonical='/chage-password'
      />
      <div className={styles.ChangePasswordSubHeading}>
        <Text textStyle='xsm' tagName='p'>Please enter your registered email</Text>
        <Text textStyle='xsm' tagName='p'>A verification code will be sent to you shortly.</Text>
      </div>

      <form className={styles.ChangePasswordForm} onSubmit={handleSubmit(handleResetPassword)}>
        <TextField
          {...register('password', { required: true, minLength: 8, maxLength: 16 })} 
          className={styles.ChangePasswordFormInput}
          id='password' 
          name='password'
          type={showPassword ? "text" : "password"}
          label='New Password (8 - 16 characters)' 
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
                  onClick={() => handleTogglePasswordVisibility('password')}
                  onMouseDown={() => handleTogglePasswordVisibility('password')}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className={styles.ChangePasswordFieldError}>
          {errors.password?.type === 'required' && !password && handleDisplayErrors(errors.password)}
          {errors.password?.type === 'minLength' && password?.length < 8 && handleDisplayErrors(errors.password)}
          {errors.password?.type === 'maxLength' && password?.length > 16 && handleDisplayErrors(errors.password)}
        </div>

        <MaterialTextField 
          refs={{...register('confirmPassword', { required: true, minLength: 8, maxLength: 16 })}}
          className={styles.ChangePasswordFormInput}
          id='confirmPassword' 
          name='confirmPassword'
          label='Confirm Password' 
          type={showConfirmPassword ? "text" : "password"}
          variant='outlined'
          size='small'
          value={confirmPassword}
          autoComplete='off'
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                    onClick={() => handleTogglePasswordVisibility('confirm-password')}
                    onMouseDown={() => handleTogglePasswordVisibility('confirm-password')}
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className={styles.ChangePasswordFieldErrorConfirm}>
          {errors.confirmPassword?.type === 'required' && !confirmPassword && handleDisplayErrors(errors.confirmPassword)}
          {errors.confirmPassword?.type === 'minLength' && confirmPassword?.length < 8 && handleDisplayErrors(errors.confirmPassword)}
          {errors.confirmPassword?.type === 'maxLength' && confirmPassword?.length > 16 && handleDisplayErrors(errors.confirmPassword)}
        </div>

        {confirmPassword && !isPasswordMatch && (
          <div className={styles.ChangePasswordFieldError}>{errorText('This field must match with your password field.')}</div>
        )}

        <MaterialButton 
          capitalize 
          size='large' 
          variant='contained'
          className={styles.ChangePasswordFormButton}
          type='submit'
          isLoading={isResettingPassword}
        >
          <Text textStyle='xl' textColor='white' bold>Reset Password</Text>
        </MaterialButton>
        </form>
    </AuthLayout>
  )
}

export default ChangePassword