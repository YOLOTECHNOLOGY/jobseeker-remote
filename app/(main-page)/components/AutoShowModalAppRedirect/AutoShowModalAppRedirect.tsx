'use client'
import { useEffect, useState } from 'react'

import { getCookie, setCookieWithExpiry } from 'helpers/cookies'
import { useUserAgent } from 'next-useragent'
import { useSearchParams, usePathname } from 'next/navigation'
import ModalAppRedirect from 'components/ModalAppRedirect'
import { isMobile } from 'react-device-detect'

const AutoShowModalAppRedirect = () => {
  const userAgent = useUserAgent(window.navigator.userAgent)
  const [show, setShow] = useState(
    () => userAgent.isMobile && !getCookie('isAppRedirectModalClosed')
  )
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')

  useEffect(() => {
    if (isMobile &&
      invitedSource &&
      referralCode &&
      pathname.indexOf('get-started') > -1) {
      setShow(false)
    }
  }, [referralCode, invitedSource, pathname, isMobile])
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
