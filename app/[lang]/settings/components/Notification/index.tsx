import { useEffect, useState } from 'react'

import Text from 'components/Text'
import { useFirstRender } from 'helpers/useFirstRender'

// api
import { emailNotificationSettingUpdate } from 'store/services/auth/emailNotificationSettingUpdate.js'

// ui
import Switch from '@mui/material/Switch'

// styles
import styles from './index.module.scss'

interface IProps {
  lang: any
  notificationSetting: any
}

const EmailNotification = (props: IProps) => {
  const { notificationSetting, lang } = props
  const { accountSetting } = lang
  const firstRender = useFirstRender()
  const [systemEmail, setSystemEmail] = useState(notificationSetting?.system_email)
  const [chatEmail, setChatEmail] = useState(notificationSetting?.chat_email)
  const [newsletterEmail, setNewsletterEmail] = useState(notificationSetting?.newsletter_email)

  useEffect(() => {
    if (firstRender) {
      return
    }
    const data = {
      system_email: systemEmail ? 1 : 0,
      chat_email: chatEmail ? 1 : 0,
      newsletter_email: newsletterEmail ? 1 : 0
    }
    emailNotificationSettingUpdate(data)
  }, [systemEmail, chatEmail, newsletterEmail])

  return (
    <div className={styles.notificationWrapper}>
      <div className={styles.navTitle}>{accountSetting?.tabs?.notification}</div>
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.receiveNewMessage}</Text>
          <p>{accountSetting.receiveNewMessageExplanation}</p>
        </div>
        <Switch checked={systemEmail} onChange={() => setSystemEmail(!systemEmail)} />
      </div>
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.receiveFromSystem}</Text>
          <p>{accountSetting.receiveFromSystemExplanation}</p>
        </div>
        <Switch checked={chatEmail} onChange={() => setChatEmail(!chatEmail)} />
      </div>
      <div className={styles.accessSettingsContainerItem}>
        <div className={styles.accessSettingsContainer_notification}>
          <Text>{accountSetting.receiveTips}</Text>
          <p>{accountSetting.receiveTipsExplanation}</p>
        </div>
        <Switch checked={newsletterEmail} onChange={() => setNewsletterEmail(!newsletterEmail)} />
      </div>
    </div>
  )
}

export default EmailNotification
