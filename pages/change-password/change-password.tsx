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
  const { email, otp } = router.query
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordMatch, setIsPasswordMatch] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const isResettingPassword = useSelector((store: any) => store.auth.resetPassword.fetching)

  useEffect(() => {
    if (confirmPassword) setIsPasswordMatch(confirmPassword === password)
  }, [confirmPassword])

  const handleTogglePasswordVisibility = (field) => {
    if (field === 'password') return setShowPassword(!showPassword)
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleResetPassword = (data) => {
    dispatch(resetPasswordRequest({ email, otp, password: data.password }))
  }

  return (
    <AuthLayout 
      headingText={<Text bold textStyle='xxxl' tagName='h2'>Update Password</Text>}
      ctaSignup
      isBackToLogin
    >
      <SEO
        title='Change Password - Bossjob'
        description='Bossjob - Career Platform for Professionals in Philippines'
        canonical='/chage-password'
      />
      <div className={styles.ChangePasswordSubHeading}>
        <Text textStyle='xsm' tagName='p'>
          Thank you for verifying.
        </Text>
        <Text textStyle='xsm' tagName='p'>
          Please enter your new password
        </Text>
      </div>

      <form className={styles.ChangePasswordForm} onSubmit={handleSubmit(handleResetPassword)}>
        <TextField
          {...register('password', {
            required: {
              value: true,
              message: 'This field is required.',
            },
            minLength: {
              value: 8,
              message: 'Must be 8 characters or more.',
            },
            maxLength: {
              value: 16,
              message: 'Must be 16 characters or less.',
            },
          })}
          className={styles.ChangePasswordFormInput}
          id='password'
          name='password'
          type={showPassword ? 'text' : 'password'}
          label='New Password (8 - 16 characters)'
          variant='outlined'
          size='small'
          value={password}
          autoComplete='off'
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
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
          {errors.password && (
            <Text textStyle='sm' textColor='red'>
              {errors.password.message}
            </Text>
          )}
        </div>

        <MaterialTextField
          refs={{
            ...register('confirmPassword', {
              required: {
                value: true,
                message: 'This field is required.',
              },
              minLength: {
                value: 8,
                message: 'Must be 8 characters or more.',
              },
              maxLength: {
                value: 16,
                message: 'Must be 16 characters or less.',
              },
            }),
          }}
          className={styles.ChangePasswordFormInput}
          id='confirmPassword'
          name='confirmPassword'
          label='Confirm Password'
          type={showConfirmPassword ? 'text' : 'password'}
          variant='outlined'
          size='small'
          value={confirmPassword}
          autoComplete='off'
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
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
          {errors.confirmPassword && (
            <Text textStyle='sm' textColor='red'>
              {errors.confirmPassword.message}
            </Text>
          )}
        </div>

        {confirmPassword && !isPasswordMatch && (
          <div className={styles.ChangePasswordFieldError}>
            <Text textStyle='sm' textColor='red'>
              This field must match with your password field.
            </Text>
          </div>
        )}

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          className={styles.ChangePasswordFormButton}
          type='submit'
          isLoading={isResettingPassword}
        >
          <Text textStyle='xl' textColor='white' bold>
            Reset Password
          </Text>
        </MaterialButton>
      </form>
    </AuthLayout>
  )
}

export default ChangePassword
