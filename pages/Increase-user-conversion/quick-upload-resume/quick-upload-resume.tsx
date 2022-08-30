import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

import useRegister from 'pages/hooks/useRegister'

import styles from './quick-upload-resume.module.scss'

const QuickUploadResume = () => {
  const {
    firstName,
    setFirstName,
    firstNameError,
    lastName,
    setLastName,
    lastNameError,
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
    showPassword,
    isSubscribe,
    setIsSubscribe,
    errors,
    register,
    handleRegister,
    isRegisteringJobseeker,
    handleOnShowPassword
  } = useRegister()

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  return (
    <div className={styles.AuthLayout}>
      <div className={styles.AuthLayoutBody}>
        <div className={styles.AuthWrapper}>
          <div className={styles.AuthLayoutTitle}>
            <Text bold textStyle='xxxl' tagName='h2'>
              {' '}
              Fill in your details to
              <br />
              continue 🎉
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

            <MaterialTextField
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
                )
              }}
              isSubmitOnEnter={true}
              onSubmit={handleRegister}
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
                Submit
              </Text>
            </MaterialButton>

            <Text className={styles.RegisterAgreement} textStyle='sm'>
              By signing up, I have read and agreed to Terms of Use
              <br />
              and Privacy Policy
            </Text>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QuickUploadResume
