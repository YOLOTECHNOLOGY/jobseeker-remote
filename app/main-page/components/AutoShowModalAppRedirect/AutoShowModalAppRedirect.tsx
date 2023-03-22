'use client'
import { useState } from 'react'

import { getCookie, setCookieWithExpiry } from 'helpers/cookies'
import { useUserAgent } from 'next-useragent'

import ModalAppRedirect from 'components/ModalAppRedirect'

const AutoShowModalAppRedirect = () => {
  const userAgent = useUserAgent(window.navigator.userAgent)
  const [show, setShow] = useState(
    () => userAgent.isMobile && !getCookie('isAppRedirectModalClosed')
  )

  return (
    <ModalAppRedirect
      currentRouter={{ asPath: '' }}
      isShowModal={show}
      handleModal={() => {
        setCookieWithExpiry('isAppRedirectModalClosed', true, 1800)
        setShow(false)
      }}
    />
  )
}
export default AutoShowModalAppRedirect
