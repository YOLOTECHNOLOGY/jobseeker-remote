import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'

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
  // const router = useRouter()

  const [userAgent, setUserAgent] = useState(null)
  const [browser, setBrowser] = useState(null)

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

  const handleOpenApp = () => {
    if (window && typeof window !== undefined) {
      // const windowPath = router.asPath
      const baseSchema = 'bossjob'
      const pathSchema = 'bossjob.ph'

      // Mobile app deep link mapping
      // if (windowPath.includes('/get-started')) {
      //   pathSchema = 'getStarted'
      // } else if (windowPath.includes('/login/jobseeker')) {
      //   pathSchema = 'login'
      // } else if (windowPath.includes('/register/jobseeker')) {
      //   pathSchema = 'register'
      // } else if (windowPath.includes('/job/')) {
      //   const jobId = windowPath?.split('-').pop()
      //   pathSchema = 'job-detail'
      //   if (jobId) pathSchema = `${pathSchema}/${jobId}`
      // } else if (windowPath.includes('/company/')) {
      //   const companyId = windowPath?.split('-').pop()
      //   pathSchema = pathSchema + 'company'
      //   if (companyId) pathSchema = `${pathSchema}/${companyId}`
      // }

      /* 
        IOS schema: BOSSJOBPH://register
        Android schema: intent://register/#Intent;scheme=BOSSJOBPH;package=com.poseidon.bossjobapp;end
      */
      const schema = `${baseSchema}://${pathSchema}`
      // const schema = `${baseSchema}://${pathSchema}`

      const appStoreLink = userAgent?.isIos
        ? process.env.APP_STORE_LINK
        : process.env.GOOGLE_PLAY_STORE_LINK

      window.location.replace(schema)

      // Wait 2s and redirect to App Store/Google Play Store if app was not opened
      setTimeout(() => {
        window.location.replace(appStoreLink)
      }, 2000)
    }
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
