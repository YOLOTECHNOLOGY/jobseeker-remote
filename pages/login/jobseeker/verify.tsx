import { useEffect } from 'react'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { setCookie } from 'helpers/cookies'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// api
import { authenticationJobseekersLogin } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const Verify = ({ query }: any) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const handleAuthenticationJobseekersLogin = () => {
    const { email, otp } = query
    const data = {
      email,
      otp,
      source: width > 576 ? 'web' : 'mobile_web'
    }
    authenticationJobseekersLogin(data)
      .then(({ data }) => {
        const userInfo = data.data
        if (userInfo.token) {
          const userCookie = {
            id: userInfo.id,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            phone_num: userInfo.phone_num,
            is_mobile_verified: userInfo.is_mobile_verified,
            avatar: userInfo.avatar,
            is_email_verify: userInfo.is_email_verify,
            // notice_period_id: loginData.notice_period_id,
            // is_bosshunt_talent: loginData.is_bosshunt_talent,
            // is_bosshunt_talent_active: loginData.is_bosshunt_talent_active,
            // bosshunt_talent_opt_out_at: loginData.bosshunt_talent_opt_out_at,
            is_profile_completed: userInfo.is_profile_completed
          }
          setCookie('user', userCookie)
          setCookie('accessToken', userInfo.token)
          if (userInfo.is_profile_completed) {
            router.push('/jobs-hiring/job-search')
          } else {
            router.push('/jobseeker-complete-profile/1')
          }
        }
      })
      .catch((error) => {
        const errorMessage = error.response.data?.errors?.error[0]
        if (errorMessage) {
          dispatch(
            displayNotification({
              open: true,
              message: errorMessage,
              severity: 'warning'
            })
          )
        }
        router.push('/get-started')
      })
  }
  useEffect(() => {
    handleAuthenticationJobseekersLogin()
  }, [])

  return <div></div>
}

export async function getServerSideProps({ query }) {
  return { props: { query } }
}
export default Verify
