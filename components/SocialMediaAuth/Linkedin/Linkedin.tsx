import React from 'react'
import classNames from 'classnames'
import queryString from 'query-string'
import axios from 'axios'

/* Styles */
import styles from '../SocialMediaAuth.module.scss'

/* Images */
import { LinkedinLogo } from 'images'

interface ILinkedin {
  className?: string
  activeKey?: number
  isLogin?: boolean
  callBackMethod?: Function
  redirect?: string | string[]
  loading?: boolean
}

declare const window: any

const Linkedin = ({
  className,
  activeKey,
  isLogin,
  callBackMethod,
  redirect,
  loading
}: ILinkedin) => {
  // const [popup, setPopup] = useState(null)

  let popup = null

  const getUserInfo = async (accessToken) => {
    try {
      const fetchUserDetail = () =>
        axios.post('/api/handlers/linkedinHandlers/userDetails', {
          accessToken: accessToken.access_token
        })
      const fetchUserEmail = () =>
        axios.post('/api/handlers/linkedinHandlers/userEmail', {
          accessToken: accessToken.access_token
        })

      const [userDetails, email] = await Promise.all([fetchUserDetail(), fetchUserEmail()])

      const payload = {
        firstName: userDetails.data.firstName.localized.en_US,
        lastName: userDetails.data.lastName.localized.en_US,
        email: email.data.elements.length ? email.data.elements[0]['handle~'].emailAddress : '',
        pictureUrl: userDetails.data.profilePicture
          ? userDetails.data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier
          : '',
        userId: userDetails.data.id,
        socialType: 'linkedin',
        accessToken: accessToken.access_token,
        redirect: redirect,
        activeKey: activeKey ? activeKey : null,
        isLogin: isLogin ? true : false
      }

      callBackMethod(payload)
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleSuccess = (data) => {
    const params = {
      grant_type: 'authorization_code',
      code: data.code,
      redirect_uri: `https://${window.location.host}/auth/linkedin`,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET
    }

    axios
      .post('/api/handlers/linkedinHandlers/accessToken', params)
      .then((response) => {
        getUserInfo(response.data)
      })
      .catch((error) => {
        console.error(error)
      })

    window.removeEventListener('message', receiveMessage, false)
  }

  const handleFailure = (error) => {
    console.error(error)

    window.removeEventListener('message', receiveMessage, false)
  }

  const receiveMessage = (event) => {
    if (event.origin === window.location.origin) {
      if (event.data.from === 'LinkedIn') {
        if (event.data.code) {
          handleSuccess({ code: event.data.code })
        } else {
          handleFailure(event.data)
        }
      }

      popup && popup.close()
    }
  }

  const handleAuthClick = () => {
    const params = {
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      redirect_uri: `https://${window.location.host}/auth/linkedin`,
      state: '423Qka4ISA8t74',
      scope: 'r_liteprofile r_emailaddress w_member_social'
    }
    const oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?${queryString.stringify(
      params
    )}`
    const width = 450
    const height = 730
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    popup = window.open(
      oauthUrl,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    )

    // window.removeEventListener('message', receiveMessage, false)
    window.addEventListener('message', receiveMessage, false)
  }

  return (
    <div
      className={
        loading
          ? classNames(className, styles.ButtonWrapper, styles.LinkedinButton, styles.disabled)
          : classNames(className, styles.ButtonWrapper, styles.LinkedinButton)
      }
      onClick={handleAuthClick}
    >
      <img
        src={LinkedinLogo}
        width={16}
        height={16}
        title='Login via Linkedin'
        alt='Login via Linkedin'
      />
    </div>
  )
}

export default Linkedin
