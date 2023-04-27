/* eslint-disable camelcase */
import React, { useEffect,useRef } from 'react'
import TransitionLoader from 'components/TransitionLoader/TransitionLoader'
import { getCookie } from 'helpers/cookies'
import useUserAgent from 'helpers/useUserAgent'
import { useRouter } from 'next/router'
const androidUrl = 'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp '
const iOSUrl = 'https://apps.apple.com/sg/app/bossjob/id1592073585'
const AppRedirect = () => {
    const { ua: userAgent } = useUserAgent()
    const accessToken = getCookie('accessToken')
    const router = useRouter()
    const timeoutRef = useRef(setTimeout(() => {
        router.push('/')
    }, 10000))
    useEffect(() => {
        if (!userAgent) {
            return
        }
        clearTimeout(timeoutRef.current)
        if (userAgent.isAndroid) {
            window.location.replace(androidUrl)
        } else {
            window.location.replace(iOSUrl)
        }
    }, [userAgent])
    return <TransitionLoader accessToken={accessToken} />
}
export const getServerSideProps = () => {

    return {
        props: {}
    }
}
export default AppRedirect