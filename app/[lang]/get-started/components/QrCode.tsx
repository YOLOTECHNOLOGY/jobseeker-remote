import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { AppDownQRCode } from 'images'
import { getQrcode, qrcodePolling } from 'store/services/auth/newLogin'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import styles from '../index.module.scss'
import Image from 'next/image'
import useGetStarted from '../hooks/useGetStarted'
import { scanHunt } from 'images'
import { scanJob } from 'images'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import CircularProgress from '@mui/material/CircularProgress'
import Toast from 'app/components/Toast'
import QrCodeDraw from './QrCodeDraw'
function guid() {
  return 'xxxxxxxx-xxxx-xxxx-yxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let timer = null

const qrCode = ({ lang }: any) => {
  const { getStatred, header } = lang

  const [current, setCurrent] = useState<number>(0)
  const [qrCodeParams, setQrCodeParams] = useState<string>('')
  const [scanInfo, setScanInfo] = useState<any>({})
  const [overtime, setOvertime] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const uuidRef = useRef(null)
  const timeRef = useRef(null)
  const { setCookiesWithLoginData, sendEventWithLoginData, defaultLoginCallBack } = useGetStarted()
  const {
    scanQRCodeOnAppToLogin,
    donHaveApp,
    howToScanQRCode,
    ImJobSeeker,
    ImRecruiter,
    menuLoginToVersion,
    magicLink: { welcomeBack },
    scannedSuccessfully,
    pleaseConfirmLoginOnAPP,
    pleaseRefreshQrCode,
    clickToRefresh,
    accountMismatch,
    loginWithQRCode
  } = getStatred

  const menu = [ImJobSeeker, ImRecruiter]
  useEffect(() => {
    getQrCodeFun()
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (userInfo?.status) {
      userInfo.token = userInfo.access_token
      getInfo(userInfo)
    }
  }, [userInfo])

  const getInfo = (userInfo) => {
    fetchUserOwnDetailService({ accessToken: userInfo.access_token }).then((res) => {
      const userDetail = { ...(res?.data?.data || {}), ...userInfo }
      setCookiesWithLoginData(userDetail)
      sendEventWithLoginData(userDetail)
      setTimeout(() => {
        defaultLoginCallBack(userDetail)
      }, 200)
    })
  }

  const judgeTime = () => {
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      qrcodePollingFun()
      if (new Date().getTime() > new Date(timeRef.current).getTime()) {
        clearInterval(timer)
        setOvertime(true)
      }
    }, 1500)
  }

  const getQrCodeFun = () => {
    const uuid = guid()
    uuidRef.current = uuid
    timeRef.current = moment(new Date()).add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')
    const parm = {
      generate_uuid: uuid,
      expiration_time: timeRef.current
    }
    getQrcode(parm).then(() => {
      setQrCodeParams(
        JSON.stringify({
          qrcode_uuid: uuid,
          // source: 'web',
          // status_id: 1,
          qr_expired_at: timeRef.current,
          website_login: 'app_scan_code'
        })
      )
      judgeTime()
    })
  }

  const qrcodePollingFun = () => {
    qrcodePolling({
      qrcode_uuid: uuidRef.current
    }).then((res) => {
      const { status, role_id } = res.data?.data
      if (status === 2) {
        if (role_id !== 1) {
          Toast.error(accountMismatch)
          getBack()
          return
        }
        setScanInfo(res.data?.data)
      } else if (status === 4) {
        clearInterval(timer)
        setUserInfo(res.data?.data)
      } else if (status === 3) {
        getBack()
      }
    })
  }

  const getBack = () => {
    clearInterval(timer)
    setScanInfo({})
    getQrCodeFun()
  }

  const refreshCode = () => {
    getQrCodeFun()
    setOvertime(false)
  }

  return (
    <>
      {scanInfo?.avatar ? (
        <>
          <h3 className={styles.codeTitle}>
            {' '}
            {welcomeBack} {scanInfo?.first_name}
          </h3>
          <div className={styles.qrAvator}>
            <img src={scanInfo?.avatar} alt='' />
          </div>

          <p className={styles.scanned}>{scannedSuccessfully}</p>
          <p className={styles.loginOn}>{pleaseConfirmLoginOnAPP}</p>
        </>
      ) : (
        <>
          <h3 className={styles.codeTitle}> {loginWithQRCode}</h3>
          <h4 className={styles.codeTitleSed}> {scanQRCodeOnAppToLogin}</h4>
          <div className={styles.qrCode}>
            <div className={styles.qrCodeBox}>
              <div className={styles.code}>
                {qrCodeParams ? <QrCodeDraw text={qrCodeParams} /> : null}
              </div>
              <div className={styles.circle}>
                <CircularProgress size={26} />
              </div>
            </div>

            {overtime && (
              <div className={styles.overTime}>
                <p>{pleaseRefreshQrCode}</p>
                <button onClick={() => refreshCode()}>{clickToRefresh}</button>
              </div>
            )}
          </div>
          <div className={styles.codeTips}>
            <span>
              {donHaveApp} <HelpOutlineIcon className={styles.icon}></HelpOutlineIcon>
              <div className={styles.popver}>
                <Image src={AppDownQRCode} alt='app down' width='124' height='124' />
                <p>
                  {header.downloadApp} <br />
                  (ios, Android)
                </p>
              </div>
            </span>
            <span>
              {howToScanQRCode}
              <HelpOutlineIcon className={styles.icon}></HelpOutlineIcon>

              <div className={`${styles.popver} ${styles.popver2}`}>
                <img src={current === 0 ? scanJob : scanHunt} className={styles.imgBg} alt='' />
                <div className={styles.popverContent}>
                  <h4>{howToScanQRCode}</h4>
                  <ul className={styles.menu}>
                    {menu.map((e, index) => (
                      <li
                        onClick={() => setCurrent(index)}
                        className={index === current ? styles.active : ''}
                        key={index}
                      >
                        {e}
                      </li>
                    ))}
                  </ul>
                  <h5>{menuLoginToVersion}</h5>
                </div>
              </div>
            </span>
          </div>
        </>
      )}
    </>
  )
}

export default qrCode
