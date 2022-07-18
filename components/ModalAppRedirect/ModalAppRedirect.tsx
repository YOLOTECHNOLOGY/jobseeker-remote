import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

/* Vendors */
import { useUserAgent } from 'next-useragent'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

/* Styles */
import styles from './ModalAppRedirect.module.scss'

/* Images */
import {
  BossjobFittedLogoApp,
  Chrome,
  Safari,
  OtherBrowser
} from 'images'

interface ModalAppRedirectProps {
  isShowModal?: boolean
  handleModal?: Function
}

const ModalAppRedirect = ({ isShowModal, handleModal }: ModalAppRedirectProps) => {
  const router = useRouter()
  const path = router.asPath
  const [userAgent, setUserAgent] = useState(null)
  const [browser, setBrowser] = useState(null)
 
  // Mobile app deep link mapping
  let schema = "BOSSJOBPH://"
  if (path.includes('/login/jobseeker')) {
    schema = schema + 'login'
  } else if (path.includes('/register/jobseeker')) {
    schema = schema + 'register'
  } else if (path.includes('/job/')) {
    const jobId = path?.split('-').pop()
    schema = schema + 'job-detail'
    if (jobId) schema = `${schema}/${jobId}`
  } else if (path.includes('/company/')) {
    const companyId = path?.split('-').pop()
    schema = schema + 'company'
    if (companyId) schema = `${schema}/${companyId}`
  }

  useEffect(() => {
    setUserAgent(useUserAgent(window.navigator.userAgent))
  }, [])

  useEffect(() => {
    if (userAgent?.isSafari || userAgent?.browser === 'Safari' || userAgent?.browser === 'Mobile Safari') {
      setBrowser({
        'title': 'Safari',
        'image': Safari
      })
    } else if (userAgent?.isChrome || userAgent?.browser === 'Chrome' || userAgent?.browser === 'GSA') {
      setBrowser({
        'title': 'Chrome',
        'image': Chrome
      })
    } else {
      setBrowser({
        'title': 'Browser',
        'image': OtherBrowser
      })
    }
  }, [userAgent])

  const handleOpenApp = () => {
    const appStoreLink = userAgent?.isIos ? process.env.APP_STORE_LINK : process.env.GOOGLE_PLAY_STORE_LINK
    
    if (typeof window !== undefined) {
      window.location.replace(schema)
    
      // Wait 2s and redirect to App Store/Google Play Store if app was not opened
      setTimeout(() => {
        window.location.replace(appStoreLink); 
      }, 2000);
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
          <img className={styles.headerLogoImage} src={BossjobFittedLogoApp} title='Bossjob logo' alt='Bossjob logo' width='40' height='40' />
          <Text className={styles.BossjobLogoText}>Bossjob App</Text>
          <div className={styles.ModalAppRedirectOptionAction}>
            <MaterialButton variant='contained' capitalize onClick={handleOpenApp}>
              <Text textStyle='base' bold textColor='white'>Open</Text>
            </MaterialButton>
          </div>
        </div>
        <div className={styles.ModalAppRedirectOption}>
          <img className={styles.headerLogoImage} src={browser?.image} title='Bossjob logo' alt='Bossjob logo' width='40' height='40' />
          <Text className={styles.BossjobLogoText}>{browser?.title}</Text>
          <div className={styles.ModalAppRedirectOptionAction}>
            <MaterialButton variant='outlined' capitalize onClick={() => handleModal()}>
              <Text textStyle='base' bold textColor='primaryBlue'>Continue</Text>
            </MaterialButton>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalAppRedirect