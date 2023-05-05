import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
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
  // currentRouter can only be used in AutoShowModalAppRedirect component. we simulate the router and make it work
  currentRouter?: { asPath: string; [key: string]: any } | NextRouter
}

const useCurrentRouter = (router?: any) => {
  return router || useRouter()
}

const ModalAppRedirect = ({
  isShowModal,
  handleModal,
  handleOpenAppCallBack,
  currentRouter
}: ModalAppRedirectProps) => {
  const router = useCurrentRouter(currentRouter)
  const goToAppTime = useRef<any>()

  const [userAgent, setUserAgent] = useState(null)
  const [browser, setBrowser] = useState(null)
  const [openAppIsLoading, setOpenAppIsLoading] = useState(false)

  const userDetail = useSelector(
    (store: any) => store.users.fetchUserOwnDetail?.response ?? getCookie('user')
  )

  useEffect(() => {
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(goToAppTime?.current)
        setOpenAppIsLoading(false)
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
      // const schema = `${baseSchema}://bossjob.ph/${pathSchema}?email=${userInfo?.email}&role=jobseeker&jobsId=${jobId}`
      // // const schema = `${baseSchema}://${pathSchema}`

      //  adjust link

      const schema = `https://cyyj.adj.st/bossjob.ph?adj_t=4pha213&adj_deep_link=bossjob%3A%2F%2Fbossjob.ph`

      const appStoreLink = userAgent?.isIos
        ? process.env.APP_STORE_LINK
        : process.env.GOOGLE_PLAY_STORE_LINK

      window.location.replace(schema)

      // Wait 2s and redirect to App Store/Google Play Store if app was not opened
      goToAppTime.current = setTimeout(() => {
        window.location.replace(appStoreLink)
      }, 3000)
    }
  }, [userDetail, userAgent])

  const handleOpenAppEvent = () => {
    handleOpenAppCallBack ? handleOpenAppCallBack() : handleOpenApp()
    setOpenAppIsLoading(true)
  }

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
              onClick={handleOpenAppEvent}
              isLoading={openAppIsLoading}
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
