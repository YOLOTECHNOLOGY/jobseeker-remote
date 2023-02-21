import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

/* Vendors */
import { useUserAgent } from 'next-useragent'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

/* Styles */
import styles from './ModalAppRedirect.module.scss'

/* Images */
import { BossjobFittedLogoApp, Chrome, Safari, OtherBrowser } from 'images'
import { getCookie } from 'helpers/cookies'

interface ModalAppRedirectProps {
  isShowModal?: boolean
  handleModal?: Function
  handleOpenAppCallBack?: Function
}

const ModalAppRedirect = ({
  isShowModal,
  handleModal,
  handleOpenAppCallBack
}: ModalAppRedirectProps) => {
  const router = useRouter()
  const goToAppTime = useRef<any>()

  const [userAgent, setUserAgent] = useState(null)
  const [browser, setBrowser] = useState(null)

  const userDetail = useSelector(
    (store: any) => store.users.fetchUserOwnDetail?.response ?? getCookie('user')
  )

  useEffect(() => {
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(goToAppTime?.current)
      }
    })
  }, [])

  useEffect(() => {
    setUserAgent(useUserAgent(window.navigator.userAgent))
  }, [])

  useEffect(() => {
    if (
      userAgent?.isSafari ||
      userAgent?.browser === 'Safari' ||
      userAgent?.browser === 'Mobile Safari'
    ) {
      setBrowser({
        title: 'Safari',
        image: Safari
      })
    } else if (
      userAgent?.isChrome ||
      userAgent?.browser === 'Chrome' ||
      userAgent?.browser === 'GSA'
    ) {
      setBrowser({
        title: 'Chrome',
        image: Chrome
      })
    } else {
      setBrowser({
        title: 'Browser',
        image: OtherBrowser
      })
    }
  }, [userAgent])

  const handleOpenApp = useCallback(() => {
    if (window && typeof window !== undefined) {
      const userInfo = Object.keys(userDetail).length ? userDetail : getCookie('user')
      console.log(userInfo, 'userDetail')
      const windowPath = router.asPath
      const baseSchema = 'bossjob'
      let pathSchema = null
      let jobId = null

      // Mobile app deep link mapping
      if (
        windowPath.includes('manage-profile') ||
        windowPath.includes('manage-profile?tab=profile')
      ) {
        pathSchema = 'online-resume'
      } else if (windowPath.includes('manage-profile?tab=job-preferences')) {
        pathSchema = 'jobs-preferences'
      } else if (windowPath.includes('/manage-profile?tab=resume')) {
        pathSchema = 'online-resume'
      } else if (windowPath.includes('jobs-hiring/job-search')) {
        pathSchema = 'home'
      } else if (windowPath.includes('/job/')) {
        jobId = windowPath.split('-')?.pop()
        pathSchema = `job-details`
      } else if (windowPath.includes('/chat/')) {
        // chatId = windowPath.split('/')?.pop()
        pathSchema = 'interview-detail'
      }

      /* 
        IOS schema: BOSSJOBPH://register
        Android schema: intent://register/#Intent;scheme=BOSSJOBPH;package=com.poseidon.bossjobapp;end
      */
      const schema = `${baseSchema}://bossjob.ph/${pathSchema}?email=${userInfo?.email}&role=jobseeker&jobsId=${jobId}`
      console.log(schema, 'schema')
      // // const schema = `${baseSchema}://${pathSchema}`

      const appStoreLink = userAgent?.isIos
        ? process.env.APP_STORE_LINK
        : process.env.GOOGLE_PLAY_STORE_LINK

      window.location.replace(schema)

      // Wait 2s and redirect to App Store/Google Play Store if app was not opened
      goToAppTime.current = setTimeout(() => {
        window.location.replace(appStoreLink)
      }, 5000)
    }
  }, [userDetail])

  return (
    <Modal
      headerTitle='Bossjob is better on the app'
      showModal={isShowModal}
      handleModal={handleModal}
    >
      <div className={styles.ModalAppRedirect}>
        <div className={styles.ModalAppRedirectOption}>
          <img
            className={styles.headerLogoImage}
            src={BossjobFittedLogoApp}
            title='Bossjob logo'
            alt='Bossjob logo'
            width='40'
            height='40'
          />
          <Text className={styles.BossjobLogoText}>Bossjob App</Text>
          <div className={styles.ModalAppRedirectOptionAction}>
            <MaterialButton
              variant='contained'
              capitalize
              onClick={() => (handleOpenAppCallBack ? handleOpenAppCallBack() : handleOpenApp())}
            >
              <Text textStyle='base' bold textColor='white'>
                Open
              </Text>
            </MaterialButton>
          </div>
        </div>
        <div className={styles.ModalAppRedirectOption}>
          <img
            className={styles.headerLogoImage}
            src={browser?.image}
            title='Bossjob logo'
            alt='Bossjob logo'
            width='40'
            height='40'
          />
          <Text className={styles.BossjobLogoText}>{browser?.title}</Text>
          <div className={styles.ModalAppRedirectOptionAction}>
            <MaterialButton variant='outlined' capitalize onClick={() => handleModal()}>
              <Text textStyle='base' bold textColor='primaryBlue'>
                Continue
              </Text>
            </MaterialButton>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalAppRedirect
