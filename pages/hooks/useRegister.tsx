import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
/* Redux Actions */
import { socialLoginRequest } from 'store/actions/auth/socialLogin'
import { registerJobseekerRequest } from 'store/actions/auth/registerJobseeker'
import Link from '../../components/Link'

export default () => {
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
      passwordErrorMessage = 'Please enter a longer password(minimum of 8 characters)'
    } else if (password?.length > 16) {
      passwordErrorMessage = 'Please enter a shorter password(maximum of 16 characters)'
    } else {
      passwordErrorMessage = null
    }
    setPasswordError(passwordErrorMessage)
  }, [password])

  useEffect(() => {
    if (registerJobseekerState.error === 'The email has already been taken.') {
      setEmailError(<p>A user with this email address already exists. Please enter a different email address or <Link to='/login/jobseeker' className='default'>log in</Link>.</p>)
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
      setPasswordError('Please enter a longer password(minimum of 8 characters)')
    }

    if (firstName && lastName && email && password && !firstNameError && !lastNameError && !emailError && !passwordError) {
      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        terms_and_condition: false,
        is_subscribe: isSubscribe,
        redirect: router.query?.redirect || null
      }

      dispatch(registerJobseekerRequest({ ...payload }))
    }
  }

  const callbackRequest = (payload) => {
    dispatch(socialLoginRequest(payload))
  }

  return {
    firstName,setFirstName,firstNameError,setFirstNameError,
    lastName,setLastName,lastNameError,setLastNameError,
    email,setEmail,emailError,setEmailError,
    password,setPassword,passwordError,setPasswordError,
    showPassword,setShowPassword,
    isSubscribe,setIsSubscribe,
    errors,
    register,
    handleRegister,
    isRegisteringJobseeker,
    registerJobseekerState,
    handleOnShowPassword,
    callbackRequest,
  }
  
}



