import axios from 'axios'
// import useragent from 'express-useragent'

import { setCookie } from 'helpers/cookies'

import { socialLoginService } from 'store/services/auth/socialLogin'
import { socialLoginSuccess } from 'store/actions/auth/socialLogin'

const googleLoginHandler = (req, res) => {
  const accessToken = req.query.access_token
  const activeKey = req.query.active_key
  // const source = req.headers['user-agent']
  // const ua = useragent.parse(source)
  // const remoteIp = req.connection.remoteAddress
  // const preloadedState = {}

  // const userAgent = {
  //   isiOS: ua.isiPod || ua.isiPhone || ua.isiPad,
  //   isAndroid: ua.isAndroid,
  //   isMobile: ua.isMobile,
  //   isTablet: ua.isTablet,
  //   isDesktop: ua.isDesktop,
  //   operatingSystem: ua.os
  // }

  axios.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + accessToken)
    .then(({data}) => {
      const payload = {
        user_id: data.sub,
        email: data.email,
        first_name: data.family_name,
        last_name: data.given_name,
        avatar: data.picture,
        token: accessToken,
        social_type: 'google',
        source: 'google-one-tap-web',
        active_key: activeKey
      }

      try {
        socialLoginService(payload)
          .then((response) => {
            socialLoginSuccess(response.data.data)

            if (response.status >= 200 && response.status < 300) {
              const userCookie = {
                active_key: response.data.data.active_key,
                id: response.data.data.id,
                first_name: response.data.data.first_name,
                last_name: response.data.data.last_name,
                email: response.data.data.email,
                phone_num: response.data.data.phone_num,
                is_mobile_verified: response.data.data.is_mobile_verified,
                avatar: response.data.data.avatar,
                additional_info: response.data.data.additional_info,
                is_email_verify: response.data.data.is_email_verify,
                notice_period_id: response.data.data.notice_period_id,
                is_profile_completed: response.data.data.is_profile_completed,
                recruiter_latest_work_xp:
                  (response.data.data.recruiter_latest_work_xp && {
                    company_id:
                      response.data.data.recruiter_latest_work_xp.company_id,
                    job_title:
                      response.data.data.recruiter_latest_work_xp.job_title
                  }) ||
                  null
              }

              const serverAccessToken =
                response.data.data.authentication.access_token
              // Set cookies (server side)
              setCookie('accessToken', serverAccessToken)
              setCookie('user', userCookie)

              res.redirect('/')
            }
          })
      } catch(err) {
        console.error(err)
      }
    })
}

export default googleLoginHandler