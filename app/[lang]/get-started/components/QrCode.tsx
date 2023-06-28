import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { AppDownQRCode } from 'images'
import { getQrcode , qrcodePolling } from 'store/services/auth/newLogin'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import styles from '../index.module.scss'
import Image from 'next/image'
import useGetStarted from '../hooks/useGetStarted'
import { scanHunt } from 'images'
import { scanJob } from 'images'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import CircularProgress from '@mui/material/CircularProgress';
function guid() {
  return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let timer = null

const qrCode = ({ lang }: any) => {
  const { getStatred, header } = lang

  const [current, setCurrent] = useState<number>(0)
  const [qrCodeImg, setQrCodeImg] = useState<any>({})
  const [scanInfo, setScanInfo] = useState<any>({})
  const [overtime, setOvertime] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const uuidRef = useRef(null)
  const timeRef = useRef(moment(new Date()).add(5, 'minute').format('YYYY-MM-DD HH:mm:ss'))
  const { setCookiesWithLoginData, sendEventWithLoginData, defaultLoginCallBack } = useGetStarted()
  const {
    scanQRCodeOnAppToLogin,
    donHaveApp,
    howToScanQRCode,
    ImJobSeeker,
    ImRecruiter,
    menuLoginToVersion,
    magicLink:{
        welcomeBack
    },
    scannedSuccessfully,
    pleaseConfirmLoginOnAPP,
    pleaseRefreshQrCode,
    clickToRefresh
  } = getStatred

  const menu = [ImJobSeeker, ImRecruiter]

  useEffect(() => {
    getQrCodeFun()
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (userInfo?.status) {
      console.log({ userInfo })
      userInfo.token = userInfo.access_token
      getInfo(userInfo)
    }
  }, [userInfo])

  const getInfo = (userInfo) => {
    fetchUserOwnDetailService({accessToken : userInfo.access_token }).then((res) => {
      const userDetail = {...(res?.data?.data || {}),...userInfo}
      console.log({userDetail})
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
    getQrcode({
      generate_uuid: uuid,
      expiration_time: timeRef.current
    }).then((res) => {
      setQrCodeImg(res.data.data)
      judgeTime()
    })
  }

  const qrcodePollingFun = () => {
    qrcodePolling({
      qrcode_uuid: uuidRef.current
    }).then((res) => {
      const { status } = res.data?.data
      if (status == 2) {
        setScanInfo(res.data?.data)
      } else if (status == 4) {
        clearInterval(timer)
        setUserInfo(res.data?.data)
      }
    })
  }

  const refreshCode = () => {
    timeRef.current = moment(new Date()).add(5, 'minute').format('YYYY-MM-DD HH:mm:ss')
    getQrCodeFun()
    setOvertime(false)
  }

  return (
    <>
      {scanInfo?.avatar ? (
        <>
          <h3 className={styles.codeTitle}> {welcomeBack} {scanInfo?.first_name}</h3>
          {/* <Image
            src={scanInfo?.avatar}
            alt=''
            fill={true}
            width='160'
            className={styles.qrAvator}
            height='160'
          /> */}
          <div className={styles.qrAvator}>
            <img src={scanInfo?.avatar} alt='' />
          </div>

          <p className={styles.scanned}>{scannedSuccessfully}</p>
          <p className={styles.loginOn}>{pleaseConfirmLoginOnAPP}</p>
        </>
      ) : (
        <>
          <h3 className={styles.codeTitle}> {scanQRCodeOnAppToLogin}</h3>
          <div className={styles.qrCode}>
            {qrCodeImg?.qrcode_base_code ? (
              <Image
                src={`data:image/gif;base64,${qrCodeImg?.qrcode_base_code}`}
                alt='app down'
                width='170'
                className={styles.qrcode}
                height='170'
              />
            ) : <CircularProgress size={26}/> }
            {overtime && (
              <div className={styles.overTime}>
                <p>{pleaseRefreshQrCode}</p>
                <button onClick={() => refreshCode()}>{clickToRefresh}</button>
              </div>
            )}
          </div>
          <p className={styles.codeTips}>
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
          </p>
        </>
      )}
    </>
  )
}

export default qrCode
