import React, { useEffect, useState } from 'react'

/* Vendors */
import { useUserAgent } from 'next-useragent'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'
import Link from 'components/Link'
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
  const [userAgent, setUserAgent] = useState(null)
  const [browser, setBrowser] = useState(null)

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
            <Link to={userAgent?.isIos ? 'https://apps.apple.com/sg/app/bossjob/id1592073585' : 'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp'}>
              <MaterialButton variant='contained' capitalize>
                <Text textStyle='base' bold textColor='white'>Open</Text>
              </MaterialButton>
            </Link>
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