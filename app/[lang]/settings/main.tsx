'use client'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import Notification from './components/Notification'
import Alerts from './components/Alerts'
import ShieldingCompany from './components/ShieldingCompany'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { isMobile } from 'react-device-detect'
import styles from './settings.module.scss'
import { useSearchParams, usePathname } from 'next/navigation'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import AccountSetting from './components/AccountSetting'
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

enum TabValues {
  Account = 0,
  Notifications = 1,
  JobAlert = 2,
  ShieldingCompany = 3
}

export default function VerticalTabs(props: any) {
  const searchParams = useSearchParams()
  const valuesTab = Object.values(TabValues).filter((k) => typeof k === 'number')
  const currentTab = valuesTab.includes(+searchParams.get('tab'))
    ? +searchParams.get('tab')
    : TabValues.Account
  const [value, setValue] = useState(currentTab)
  const { accessToken, lang, config, userDetail } = props
  const pathname = usePathname()
  const { push } = useContext(LoadingContext)

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    push(pathname + '?' + createQueryString('tab', newValue))
  }

  const { accountSetting } = lang

  return (
    <Box
      className={styles.settingsContainer}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row'
      }}
    >
      <div className={styles.settingsTabs}>
        {isMobile ? null : <div className={styles.settingsTitle}>Settings</div>}
        <Tabs
          orientation={isMobile ? 'horizontal' : 'vertical'}
          variant='scrollable'
          value={value}
          onChange={handleChange}
        >
          <Tab
            label={<div className={styles.lineCamp}>Account Setting</div>}
            {...a11yProps(TabValues.Account)}
          />
          <Tab
            label={<div className={styles.lineCamp}>Notification</div>}
            {...a11yProps(TabValues.Notifications)}
          />
          <Tab
            label={<div className={styles.lineCamp}>Job Alert</div>}
            {...a11yProps(TabValues.JobAlert)}
          />
          <Tab
            label={<div className={styles.lineCamp}>Shielding Company</div>}
            {...a11yProps(TabValues.ShieldingCompany)}
          />
        </Tabs>
      </div>
      <div className={styles.settingsPanel}>
        <TabPanel value={value} index={0}>
          <AccountSetting lang={lang} userDetail={userDetail} config={config} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Notification
            label={accountSetting.notify}
            notificationSetting={userDetail ? userDetail.email_notification_setting : null}
            lang={lang}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Alerts accessToken={accessToken} lang={lang} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ShieldingCompany lang={lang} />
        </TabPanel>
      </div>
    </Box>
  )
}
