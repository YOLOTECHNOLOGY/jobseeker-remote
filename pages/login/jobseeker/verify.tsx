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
        if (data.data.token) {
          setCookie('accessToken', data.data.token)
          // Only jump to this page for now
          router.push('/jobseeker-complete-profile/1')
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
