import { useEffect, useState } from 'react'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import Text from 'components/Text'
import { useFirstRender } from 'helpers/useFirstRender'

// api
import { emailNotificationSettingUpdate } from 'store/services/auth/emailNotificationSettingUpdate.js'

// ui
import Switch from '@mui/material/Switch'

// styles
import styles from './index.module.scss'

const EmailNotificationsetting = ({
  label,
  setEdit,
  edit,
  emailNotificationSetting,
  lang
}: any) => {
  const { accountSetting } = lang
  const firstRender = useFirstRender()
  const [systemEmail, setSystemEmail] = useState(emailNotificationSetting?.system_email)
  const [chatEmail, setChatEmail] = useState(emailNotificationSetting?.chat_email)
  const [newsletterEmail, setNewsletterEmail] = useState(emailNotificationSetting?.newsletter_email)

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
    <div className={styles.VerifyMailAndBindEmail}>
      <FieldFormWrapper label={label} edit={edit} setEdit={setEdit}>
        <div className={styles.accessSettingsContainer_swtich}>
          <div className={styles.accessSettingsContainer_notification}>
            <Text>{accountSetting.receiveNewMessage}</Text>
            <p>{accountSetting.receiveNewMessageExplanation}</p>
          </div>

          <Switch checked={systemEmail} onChange={() => setSystemEmail(!systemEmail)} />
        </div>
        <div className={styles.accessSettingsContainer_swtich}>
          <div className={styles.accessSettingsContainer_notification}>
            <Text>{accountSetting.receiveFromSystem}</Text>
            <p>{accountSetting.receiveFromSystemExplanation}</p>
          </div>
          <Switch
            checked={chatEmail}
            // onChange={(ev) => {}}
            onChange={() => setChatEmail(!chatEmail)}
          />
        </div>
        <div className={styles.accessSettingsContainer_swtich}>
          <div className={styles.accessSettingsContainer_notification}>
            <Text>{accountSetting.receiveTips}</Text>
            <p>{accountSetting.receiveTipsExplanation}</p>
          </div>
          <Switch
            checked={newsletterEmail}
            onChange={() => setNewsletterEmail(!newsletterEmail)}
            // onChange={(ev) => {}}
          />
        </div>
      </FieldFormWrapper>
    </div>
  )
}

export default EmailNotificationsetting
