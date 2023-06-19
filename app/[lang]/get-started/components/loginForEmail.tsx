import React, { useState, useRef ,memo, useEffect} from 'react'
import styles from '../index.module.scss'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import PhoneLink from './link/phone'
import Divider from '@mui/material/Divider'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import EmailComponent from './emailComponent'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { usePathname } from 'next/navigation'
import { formatTemplateString } from 'helpers/formatter'
import Link from 'next/link'
import { CircularProgress } from 'app/[lang]/components/MUIs'
interface IProps {
  lang: any
}

const loginForEmail = (props: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const {
    lang: { newGetStarted }
  } = props

  const [email, setEmail] = useState<string>('')
  const [isDisable, setDisable] = useState<boolean>(true)
  const [loading,setLoading] = useState<boolean>(false)
  const pathname = usePathname()
  const emailRef = useRef(null)
 
  useEffect(()=>{
   if(email){
    emailRef.current = email
   }
  },[email])

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDownEnter)
    return () => window.removeEventListener('keydown', handleOnKeyDownEnter)
  }, [isDisable])
 
  const handleOnKeyDownEnter = (e) => {
    console.log(email,22222)
    if (e.key === 'Enter' && e.keyCode === 13 && !isDisable) {
      sendOpt()
    }
  }

  const sendOpt = () => {
    setLoading(true)
    authenticationSendEmaillOtp({email: emailRef.current })
      .then((res) => {
        const { user_id, avatar } = res?.data?.data ?? {}
        if (user_id) {
          router.push(`${pathname}?step=2&&email=${emailRef.current}&userId=${user_id}&avatar=${avatar}`)
        } else {
          router.push(`${pathname}?step=2&&email=${emailRef.current}`)
        }
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ?? newGetStarted.optError,
            severity: 'error'
          })
        )
      }).finally(()=>  setLoading(false))
  }

  const agreementWord = formatTemplateString(newGetStarted.agreement, {
    value1: `<a
        target='_blank'
        href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
      >
          ${newGetStarted.termsOfUse}
      </a>`,
    value2: `<a
        target='_blank'
        href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
      >
        ${newGetStarted.privacyPolicy}
      </a>`
  })

  return (
    <>
      <h2>{newGetStarted.title}</h2>
      <div className={styles.phoneNumber}>
      {/* <form  autoComplete='on' onSubmit={e => e.preventDefault()}>
        <div style={{ opacity: 0, height: '1px', overflow: 'hidden', pointerEvents: 'none' }}>
          <input
            type="email"
            value={email}
            name="email-hidden"
            hidden
            autoComplete="on"
          />
          <input
            type="password"
            value={(email || '').trim() ? ' ' : ''}
            name="hidden-password"
            autoComplete="on"
          />
        </div> */}
        <div className={styles.item}>
          <EmailComponent
            lang={props.lang}
            setEmail={setEmail}
            setDisable={setDisable}
            email={email}
          />
        </div>
        <button  className={styles.btn} disabled={isDisable} onClick={sendOpt}>
          {
           loading ? <CircularProgress color={'primary' } size={16} /> : newGetStarted.sendCode
          }
        </button>
        {/* </form> */}
        <p className={styles.msg} dangerouslySetInnerHTML={{ __html: agreementWord }}></p>
        <p className={styles.tips}>
          {newGetStarted.tips}{' '}
          <Link
            href={
              process.env.ENV === 'development'
                ? 'https://dev.employer.bossjob.com'
                : 'https://employer.bossjob.com'
            }
            className={styles.AuthCTALink}
          >
            {newGetStarted.employer}
          </Link>
        </p>
      </div>
      <div>
        <div className={classNames([styles.divider, styles.divider_none])}>
          <Divider>{newGetStarted.continueWith}</Divider>
        </div>
      </div>
      <div className={styles.list}>
        <GoogleLogin lang={props.lang} />
        <FacebookLogin lang={props.lang} />
        <AppleLogin lang={props.lang} />
        <PhoneLink lang={props.lang} />
      </div>
    </>
  )
}
export default memo(loginForEmail)
