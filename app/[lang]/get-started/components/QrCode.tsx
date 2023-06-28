import React, { useEffect, useState,useRef } from 'react'
import moment from 'moment'
import { AppDownQRCode } from 'images'
import { getQrcode , qrcodePolling } from 'store/services/auth/newLogin'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import styles from '../index.module.scss'
import Image from 'next/image'
import useGetStarted from '../hooks/useGetStarted'
import { scanHunt } from 'images'

function guid() {
  return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let timer = null;


const qrCode = ({ lang }: any) => {
  const { getStatred, header } = lang

  const [current, setCurrent] = useState<number>(0)
  const [qrCodeImg, setQrCodeImg] = useState<any>({})
  const [scanInfo, setScanInfo] = useState<any>({})
  const [overtime, setOvertime] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const uuidRef = useRef(null)
  const timeRef = useRef(moment(new Date()).add(5, 'minute').format('YYYY-MM-DD HH:mm:ss'))
  const {
    setCookiesWithLoginData,
    sendEventWithLoginData,
    defaultLoginCallBack
  } = useGetStarted()
  const {
    scanQRCodeOnAppToLogin,
    donHaveApp,
    howToScanQRCode,
    ImJobSeeker,
    ImRecruiter,
    menuLoginToVersion
  } = getStatred

  const menu = [ImJobSeeker, ImRecruiter]

  useEffect(() => {
    getQrCodeFun()
    return ()=> clearInterval(timer)
  }, [])


  useEffect(()=>{
   if(userInfo?.status){
    setCookiesWithLoginData(userInfo)
    sendEventWithLoginData(userInfo)
    defaultLoginCallBack(userInfo)
   }
  },[userInfo])


const judgeTime = () => {
    if(timer) clearInterval(timer)
    timer = setInterval(()=>{
      //  qrcodePollingFun();
        if(new Date().getTime() > new Date(timeRef.current).getTime()){
            clearInterval(timer)
            setOvertime(true)
        }
     },1500)
}


  const getQrCodeFun = () => {
    const uuid =   guid()
    uuidRef.current = uuid;
    getQrcode({
      generate_uuid: uuid,
      expiration_time:timeRef.current
    }).then((res) => {
      setQrCodeImg(res.data.data)
      judgeTime();
    })
  }

  const qrcodePollingFun = ()=>{
    qrcodePolling({
        qrcode_uuid:  uuidRef.current
    }).then(res=>{
        console.log(res.data?.data?.status,99999)
        const {status} = res.data?.data
        if(status == 2){
            setScanInfo(res.data?.data)
        }else if(status == 4){
           clearInterval(timer)
           setUserInfo(res.data?.data)
        }
    })
  }

  const refreshCode = () => {
    timeRef.current = moment(new Date()).add(5, 'minute').format('YYYY-MM-DD HH:mm:ss')
    getQrCodeFun();
    setOvertime(false)
  }

  return (
    <>
      {
        scanInfo?.avatar ? <>
        <h3 className={styles.codeTitle}> Welcome back</h3>
        <Image
            src={scanInfo?.avatar}
            alt=''
            width='160'
            className={styles.qrAvator}
            height='160'
          />
         <p className={styles.scanned}>Scanned successfully</p> 
         <p className={styles.loginOn}>Please confirm login on APP</p> 
        </> : <>
      <h3 className={styles.codeTitle}> {scanQRCodeOnAppToLogin}</h3>
      <Image
            src={scanHunt}
            alt=''
            width='160'
            className={styles.qrAvator}
            height='160'
          />
      <div className={styles.qrCode}>
        {qrCodeImg?.qrcode_base_code && (
          <Image
            src={`data:image/gif;base64,${qrCodeImg?.qrcode_base_code}`}
            alt='app down'
            width='170'
            className={styles.qrcode}
            height='170'
          />
        )}
        {
        overtime &&  <div className={styles.overTime}>
            <p>请重新刷新二维码</p>
            <button onClick={()=>refreshCode()}>点击刷新</button>
        </div>
        }
       
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
            <Image src={AppDownQRCode} alt='app down' width='124' height='124' />
          </div>
        </span>
      </p>  
        </>
      }
    


    </>
  )
}

export default qrCode
