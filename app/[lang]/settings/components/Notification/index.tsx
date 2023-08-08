import { useState, useTransition } from 'react'

import Text from 'components/Text'
import { useRouter } from 'next/navigation'

// api
import {
  emailNotificationSettingUpdate,
  smsNotificationSettingUpdate
} from 'store/services/auth/emailNotificationSettingUpdate.js'

// ui
import Switch from '@mui/material/Switch'

// styles
import styles from './index.module.scss'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { useDispatch } from 'react-redux'
import { formatTemplateString } from 'helpers/formatter'

interface IProps {
  lang: any
  userDetail: any
}

const EmailNotification = (props: IProps) => {
  const { userDetail, lang } = props
  const { accountSetting } = lang
  const errorCode = lang.errorcode || {}

  const notificationSetting = userDetail ? userDetail.email_notification_setting : {}
  const SMSNotificationSetting = userDetail ? userDetail.sms_notification_setting : {}

  const dispatch = useDispatch()

  const [systemEmail, setSystemEmail] = useState(!!notificationSetting?.system_email)
  const [chatEmail, setChatEmail] = useState(!!notificationSetting?.chat_email)
  const [newsletterEmail, setNewsletterEmail] = useState(!!notificationSetting?.newsletter_email)

  const [systemSMS, setSystemSMS] = useState(!!SMSNotificationSetting?.system_sms)
  const [chatSMS, setChatSMS] = useState(!!SMSNotificationSetting?.chat_sms)

  const router = useRouter()
  const [_, startTransition] = useTransition()


  console.log('userDetail', {userDetail, SMSNotificationSetting, systemSMS, chatSMS})

  const handleError = (error) => {
    const { data } = error.response
    let errorMessage
    if (data?.data) {
      errorMessage = data?.data?.detail ?? data?.message
    } else {
      const errors = Object.values(data?.errors)[0]
      if (errors) {
        errorMessage = errors[0]
      }
    }

    const code = data?.code
    let transErr = errorCode[code]
    if (code === 40006) {
      transErr = formatTemplateString(transErr, {
        retry_after: error?.response?.data?.errors?.retry_after
      })
    }

    dispatch(
      displayNotification({
        open: true,
        message: transErr || errorMessage || data.message,
        severity: 'error'
      })
    )
  }

  const handleEmailChange = (ev:React.ChangeEvent<HTMLInputElement>, type:string) => {
    if(!type) return
    const value = ev.target.checked

    const data = {
      system_email: systemEmail ? 1 : 0,
      chat_email: chatEmail ? 1 : 0,
      newsletter_email: newsletterEmail ? 1 : 0
    }

    data[type] = value ? 1 : 0

    emailNotificationSettingUpdate(data).then(() => {
      if (type === 'system_email') {
        setSystemEmail(value)
      } else if (type === 'chat_email') {
        setChatEmail(value)
      } else {
        setNewsletterEmail(value)
      }
      startTransition(() => {
        router.refresh()
      })
    })
    .catch((err) => handleError(err))
  }

  const handleSMSChange = (ev: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if(!type) return
    const value = ev.target.checked

    const data = {
      system_sms: systemSMS ? 1 : 0,
      chat_sms: chatSMS ? 1 : 0
    }

    data[type] = value ? 1 : 0

    smsNotificationSettingUpdate(data)
      .then(() => {
        if (type === 'system_sms') {
          setSystemSMS(value)
        } else {
          setChatSMS(value)
        }
        startTransition(() => {
          router.refresh()
        })
      })
      .catch((err) => handleError(err))
  }

  return (
    <div className={styles.notificationWrapper}>
      <div className={styles.navTitle}>{accountSetting?.tabs?.notification}</div>

      {/* Email Notification */}
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.receiveNewMessage}</Text>
          <p>{accountSetting.receiveNewMessageExplanation}</p>
        </div>
        <Switch checked={chatEmail} onChange={(ev) => handleEmailChange(ev, 'chat_email')} />
      </div>
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.receiveFromSystem}</Text>
          <p>{accountSetting.receiveFromSystemExplanation}</p>
        </div>
        <Switch checked={systemEmail} onChange={(ev) => handleEmailChange(ev, 'system_email')} />
      </div>
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.receiveTips}</Text>
          <p>{accountSetting.receiveTipsExplanation}</p>
        </div>
        <Switch checked={newsletterEmail} onChange={(ev) => handleEmailChange(ev, 'newsletter_email')} />
      </div>

      {/* SMS Notification */}
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.smsSystemTip}</Text>
          <p>{accountSetting.smsSystemExplanation}</p>
        </div>
        <Switch checked={systemSMS} onChange={(ev) => handleSMSChange(ev, 'system_sms')} />
      </div>
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.smsChatTip}</Text>
          <p>{accountSetting.smsChatExplanation}</p>
        </div>
        <Switch checked={chatSMS} onChange={(ev) => handleSMSChange(ev, 'chat_sms')} />
      </div>
    </div>
  )
}

export default EmailNotification
