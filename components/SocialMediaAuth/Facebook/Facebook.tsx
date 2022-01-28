import classNames from 'classnames'

/* Styles */
import styles from '../SocialMediaAuth.module.scss'

/* Images */
import { FacebookLogo } from 'images'

interface IFacebook {
  className?: string,
  activeKey?: number,
  isLogin?: boolean,
  callBackMethod?: Function,
  redirect?: string | string[],
  loading?: boolean
}

declare const window: any;

const Facebook = ({
  className,
  activeKey,
  isLogin,
  callBackMethod,
  redirect,
  loading
}: IFacebook) => {
  const handleAuthClick = () => {
    let accessToken

    window.FB.login(
      function(response) {
        if (response.authResponse) {
          accessToken = response.authResponse.accessToken

          window.FB.api('/me?fields=id,first_name,last_name,email', function(
            response
          ) {
            const payload = {
              userId: response.id,
              firstName: response.first_name,
              lastName: response.last_name,
              email: response.email,
              pictureUrl: response.profile_pic,
              accessToken: accessToken,
              socialType: 'fb',
              redirect: redirect,
              activeKey: activeKey ? activeKey : null,
              isLogin: isLogin ? true : false
            }

            callBackMethod(payload)
          })
        } else {
          // User cancelled login or did not fully authorize
        }
      },
      {
        scope: 'email'
      }
    )
  }

  return (
    <div
      className={
        loading
          ? classNames(className, styles.ButtonWrapper, styles.FacebookButton, styles.disabled)
          : classNames(className, styles.ButtonWrapper, styles.FacebookButton)
      }
      onClick={handleAuthClick}
    >
      <img
        src={FacebookLogo}
          width={9}
          height={16}
        title="Login via Facebook"
        alt="Login via Facebook"
      />
    </div>
  )
}

export default Facebook