/* eslint-disable camelcase */
'use client'
import React, { useEffect, useRef } from 'react'
import useUserAgent from 'helpers/useUserAgent'
import { useRouter } from 'next/navigation'

import Loading from 'app/components/loading'
import styles from './index.module.scss'

const androidUrl = 'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp '
const iOSUrl = 'https://apps.apple.com/sg/app/bossjob/id1592073585'

const AppRedirect = () => {
    const { ua: userAgent } = useUserAgent()
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
    return (
        <div className={styles.wrapper}>
          <div className={styles.loadingWrapper}>
            <Loading />
          </div>
        </div>
      )
}

export default AppRedirect