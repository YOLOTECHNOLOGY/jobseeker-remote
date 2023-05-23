import React, { useState, useEffect } from 'react'
import { wrapper } from 'store'
import { END } from 'redux-saga'

import Layout from 'components/Layout'
import Text from 'components/Text'
import VerifyMailAndBindEmail from 'components/AccountSettings/VerifyMailAndBindEmail'
import VerifyPhoneNumber from 'components/AccountSettings/VerifyPhoneNumber'
import EmailNotificationsetting from 'components/AccountSettings/EmailNotificationSetting'
import Alerts from 'components/AccountSettings/Alerts'

// mui
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { ThemeProvider, createTheme } from '@mui/material'

// actions
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserDetailRequest } from 'store/actions/users/fetchUserDetail'

// styles
import styles from './settings.module.scss'

import { useDispatch, useSelector } from 'react-redux'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { getDictionary } from 'get-dictionary'
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  )
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const COUNT_DOWN_VERIFY_DEFAULT = 60
// const countDownVerify = COUNT_DOWN_VERIFY_DEFAULT

const AccountSettings = ({ accessToken, lang }: any) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const config = useSelector((store: any) => store?.config?.config?.response)

  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  const [value, setValue] = useState(0)
  const [edit, setEdit] = useState(null)

  const userDetail = useSelector((store: any) => store.users.fetchUserDetail.response)

  const getInitData = () => {
    dispatch(fetchUserDetailRequest({ accessToken }))
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const theme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: 'transparent',
            display: 'flex'
          }
        }
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            alignItems: 'flex-start',
            display: 'flex'
          }
        }
      }
    }
  })

  const themeMobile = createTheme({
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            alignItems: 'flex-start',
            display: 'flex'
          }
        }
      }
    }
  })

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      window.onload = () => {
        // @ts-ignore #
        if (typeof window.FB !== undefined) {
          // @ts-ignore #
          // initFBCheckbox()
        }
      }
    }
  })
  const { accountSetting } = lang
  return (
    <Layout lang={lang}>
      <div className={styles.accessSettings}>
        <div className={styles.accessSettingsTabs}>
          {(width ?? 0) > 576 && (
            <Text tagName='h2' bold className={styles.accessSettingsTabsTitle}>
              {accountSetting.title}
            </Text>
          )}
          {width && (
            <ThemeProvider theme={width > 576 ? theme : themeMobile}>
              <Tabs
                orientation={width > 576 ? 'vertical' : 'horizontal'}
                value={value}
                onChange={handleChange}
                classes={{
                  flexContainer: styles.accessSettingsTabs_tab,
                  scroller: styles.accessSettingsTabs_scrollButtons
                }}
              >
                <Tab
                  label={accountSetting.tabs.account}
                  {...a11yProps(0)}
                  sx={{ textTransform: 'none', paddingLeft: '0' }}
                />
                <Tab
                  label={accountSetting.tabs.jobAlert}
                  {...a11yProps(1)}
                  sx={{ textTransform: 'none', paddingLeft: '0' }}
                />
              </Tabs>
            </ThemeProvider>
          )}
        </div>

        <div className={styles.accessSettingsContainer}>
          <TabPanel value={value} index={0}>
            <VerifyMailAndBindEmail
              label={accountSetting.email}
              edit={edit}
              setEdit={setEdit}
              isEdit
              errorText={errorText}
              emailDefault={userDetail?.email ? userDetail.email : null}
              verify={userDetail.is_email_verify}
              getInitData={getInitData}
              COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
              lang={lang}
            />

            <VerifyPhoneNumber
              label={accountSetting.mobile}
              edit={edit}
              setEdit={setEdit}
              isEdit
              errorText={errorText}
              phoneDefault={userDetail.phone_num ? userDetail.phone_num : null}
              verify={userDetail.is_mobile_verified}
              config={config}
              getInitData={getInitData}
              COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
              lang={lang}
            />

            <EmailNotificationsetting
              label={accountSetting.notify}
              edit={edit}
              setEdit={setEdit}
              emailNotificationSetting={userDetail ? userDetail.email_notification_setting : null}
              lang={lang}
            />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Alerts accessToken={accessToken} lang={lang} />
          </TabPanel>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const lang = await getDictionary(query.lang as 'en-US')
  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/dashboard/profile/settings',
        permanent: false,
        lang
      }
    }
  }

  store.dispatch(fetchUserDetailRequest({ accessToken }))
  // store.dispatch(fetchConfigRequest())

  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  // const config = storeState.config.config.response
  const userDetail = storeState.users.fetchUserDetail.response
  return {
    props: {
      lang,
      accessToken,
      userDetail
    }
  }
})

export default AccountSettings
