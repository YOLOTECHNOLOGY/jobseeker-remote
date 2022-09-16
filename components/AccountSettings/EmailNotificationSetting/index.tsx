import { useEffect, useState } from 'react'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import Text from 'components/Text'
import { useFirstRender } from 'helpers/useFirstRender'

// api
import { emailNotificationUpdate } from 'store/services/auth/changeEmail'

// ui
import Switch from '@mui/material/Switch'

// styles
import styles from './index.module.scss'

const EmailNotificationsetting = ({ label, setEdit, edit, emailNotificationSetting }: any) => {
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
    emailNotificationUpdate(data)
  }, [systemEmail, chatEmail, newsletterEmail])

  return (
    <div className={styles.VerifyMailAndBindEmail}>
      <FieldFormWrapper label={label} edit={edit} setEdit={setEdit}>
        <div className={styles.accessSettingsContainer_swtich}>
          <Text>Receive system notifications:</Text>
          <Switch checked={systemEmail} onChange={() => setSystemEmail(!systemEmail)} />
        </div>
        <div className={styles.accessSettingsContainer_swtich}>
          <Text>Receive new chat notifications:</Text>
          <Switch
            checked={chatEmail}
            // onChange={(ev) => {}}
            onChange={() => setChatEmail(!chatEmail)}
          />
        </div>
        <div className={styles.accessSettingsContainer_swtich}>
          <Text>Receive career and hiring tips newsletter:</Text>
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
