import { useEffect } from 'react'
import useWindowDimensions from 'helpers/useWindowDimensions'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { jobbseekersLoginRequest } from 'store/actions/auth/jobseekersLogin'

// api
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

const Verify = ({ query }: any) => {
  const router = useRouter()
  const routerQuery = router.query
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()

  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)
  const error = useSelector((store: any) => store.auth.jobseekersLogin.error)

  useEffect(() => {
    if (!Object.keys(userInfo).length) {
      return
    }
    const { data } = userInfo
    logSuccess(data)
  }, [userInfo])

  useEffect(() => {
    if (!error) {
      return
    }
    const errorMessage = error.data?.errors?.error[0]
    loginFailed(errorMessage)
  }, [error])

  useEffect(() => {
    const { email, otp } = query
    const data = {
      email,
      otp,
      source: width > 576 ? 'web' : 'mobile_web'
    }
    dispatch(jobbseekersLoginRequest(data))
  }, [])

  const logSuccess = (data: any) => {
    const defaultToPath =
      data.is_profile_update_required || !data.is_profile_completed
        ? '/jobseeker-complete-profile/1'
        : `/jobs-hiring/job-search`
    let redirect
    if (Array.isArray(routerQuery.redirect)) {
      redirect = routerQuery.redirect[0]
    } else {
      redirect = routerQuery.redirect
    }
    router.push(redirect ? redirect : defaultToPath)
  }

  const loginFailed = (errorMessage: string | null) => {
    if (errorMessage) {
      dispatch(
        displayNotification({
          open: true,
          message: 'Oops! That magic link has expired. Please try again.',
          severity: 'warning'
        })
      )
    }
    const defaultToPath = '/get-started'
    let redirectFail
    if (Array.isArray(routerQuery.redirect_fail)) {
      redirectFail = routerQuery.redirect_fail[0]
    } else {
      redirectFail = routerQuery.redirect_fail
    }
    router.push(redirectFail ? redirectFail : defaultToPath)
  }

  return ''
}

export async function getServerSideProps({ query }) {
  return { props: { query } }
}
export default Verify
