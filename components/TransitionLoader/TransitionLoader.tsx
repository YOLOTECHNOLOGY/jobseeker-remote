import React,{useEffect,useState} from 'react'
import * as ReactDOM from 'react-dom'
import styles from './TransitionLoader.module.scss'
import LinearProgress from '@mui/material/LinearProgress'
import { BossjobLogo } from '../../images'
import PlaceholderProtectedHeader from '../Header/PlaceholderProtectedHeader'
import PlaceHolderPublicHeader from '../Header/PlaceholderPublicHeader'
import { getCookie } from '../../helpers/cookies'
import { getDictionary } from 'get-dictionary'
type TransitionLoaderProps = {
  accessToken?: any,
  lang?:any
}

function TransitionLoader(props: TransitionLoaderProps) {
 const { accessToken,lang } = props
 const [langDir,setLang] = useState({})
const user = getCookie('user')
  useEffect(()=>{
   if(lang){
    const fetchLang = async ()=>{
      return await getDictionary(lang)
      
    } 
     fetchLang().then(res =>{
      const data:any = res
      setLang(data.header)
    })
   }
  },[lang])
  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        {accessToken && <PlaceholderProtectedHeader   lang={langDir} isShowEmailAlert={accessToken && user &&!user.is_email_verify} />}
        {!accessToken && <PlaceHolderPublicHeader lang={langDir}/>}
      </div>
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingLogo}>
          <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
        </div>
        <div className={styles.loadingIndicator}>
          <LinearProgress />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TransitionLoader
