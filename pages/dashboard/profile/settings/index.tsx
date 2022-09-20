import React, { useState, useEffect, useRef } from 'react'
import { wrapper } from 'store'
import { END } from 'redux-saga'

import Layout from 'components/Layout'
import Text from 'components/Text'
import CreditCardFrom from 'components/CreditCardFrom/CreditCardFrom'
import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import VerifyMailAndBindEmail from 'components/AccountSettings/VerifyMailAndBindEmail'
import VerifyPhoneNumber from 'components/AccountSettings/VerifyPhoneNumber'
import ChangePasswrod from 'components/AccountSettings/ChangePassword'
import EmailNotificationsetting from 'components/AccountSettings/EmailNotificationSetting'
import Alerts from 'components/AccountSettings/Alerts'
import FbMessengerCheckin from 'components/FbMessengerCheckin'

// mui
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Switch from '@mui/material/Switch'
import { ThemeProvider, createTheme } from '@mui/material'

// actions
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// api
import { facebookMsgDeactivate } from 'store/services/auth/changeEmail'

// styles
import styles from './settings.module.scss'

import { accountSetting } from 'store/services/auth/changeEmail'
import { getCookie } from 'helpers/cookies'
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

const COUNT_DOWN_VERIFY_DEFAULT = 10
let countDownVerify = COUNT_DOWN_VERIFY_DEFAULT

const AccountSettings = ({ userOwnDetail, config, userDetail, accessToken }: any) => {
  const refCountDownTimeName = useRef(null)

  const [userId, setUserId] = useState(null)
  const [value, setValue] = useState(0)
  const [edit, setEdit] = useState(null)

  const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)
  const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)

  useEffect(() => {
    setUserId(getCookie('user')?.id)
  }, [])

  // Count Down
  useEffect(() => {
    if (isShowCountDownSwitch) {
      const eventCallBack = () => {
        if (countDownVerify <= 1) {
          setIsShowCountDownSwitch(false)
          clearInterval()
        } else {
          countDownVerify = countDownVerify - 1
          setCountDown(countDownVerify)
        }
      }
      refCountDownTimeName.current = setInterval(eventCallBack, 1000)
      return () => clearInterval(refCountDownTimeName.current)
    } else {
      clearInterval(refCountDownTimeName.current)
      // setBtnDisabled(false)
      countDownVerify = COUNT_DOWN_VERIFY_DEFAULT
      setCountDown(COUNT_DOWN_VERIFY_DEFAULT)
    }
  }, [isShowCountDownSwitch])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const theme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: 'transparent'
          }
        }
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            alignItems: 'flex-start'
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

  // const requiredLabel = (text: string) => {
  //   return (
  //     <>
  //       <span>{text}</span>
  //       <span className={styles.stepFieldRequired}>*</span>
  //     </>
  //   )
  // }

  const sendFbMessengerCheckboxEvent = (ref: number, userRef: string) => {
    if (typeof window !== undefined) {
      ;(window as any).FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, {
        app_id:
          process.env.CUSTOM_NODE_ENV === 'production' ? '2026042927653653' : '2111002932479859',
        page_id:
          process.env.CUSTOM_NODE_ENV === 'production' ? '307776753021449' : '638091659945858',
        ref: ref,
        user_ref: userRef
      })
    }
  }

  const comfirmOptIn = (ev) => {
    if (ev.target.checked) {
      sendFbMessengerCheckboxEvent(getCookie('user').id, 'account_' + getCookie('user').id)
    } else {
      facebookMsgDeactivate()
    }
    // Send Facebook checkbox messenger opt-in event
    //

    // Wait for 3 seconds for the FB event callback hits the server
    setTimeout(function () {
      if (typeof window !== undefined) {
        window.location.reload()
      }
    }, 3000)
  }

  return (
    <Layout>
      <div className={styles.accessSettings}>
        <div className={styles.accessSettingsTabs}>
          <Text tagName='h2' bold className={styles.accessSettingsTabsTitle}>
            Account Setting
          </Text>

          <ThemeProvider theme={theme}>
            <Tabs orientation='vertical' value={value} onChange={handleChange}>
              <Tab
                label='Account'
                {...a11yProps(0)}
                sx={{ textTransform: 'none', paddingLeft: '0' }}
              />
              <Tab
                label='Job Alert'
                {...a11yProps(1)}
                sx={{ textTransform: 'none', paddingLeft: '0' }}
              />
            </Tabs>
          </ThemeProvider>
        </div>

        <div className={styles.accessSettingsContainer}>
          <TabPanel value={value} index={0}>
            <VerifyMailAndBindEmail
              label='Email'
              edit={edit}
              setEdit={setEdit}
              isEdit
              errorText={errorText}
              emailDefault={userOwnDetail.email ? userOwnDetail.email : null}
              valid={userOwnDetail.is_email_verify}
              setIsShowCountDownSwitch={setIsShowCountDownSwitch}
              isShowCountDownSwitch={isShowCountDownSwitch}
              countDown={countDown}
            />

            {/*  mobile number  */}
            <VerifyPhoneNumber
              label='Mobile Number'
              edit={edit}
              setEdit={setEdit}
              isEdit
              errorText={errorText}
              phoneDefault={userOwnDetail.phone_num ? userOwnDetail.phone_num : null}
              valid={userOwnDetail.is_mobile_verified}
              setIsShowCountDownSwitch={setIsShowCountDownSwitch}
              isShowCountDownSwitch={isShowCountDownSwitch}
              countDown={countDown}
              config={config}
            />

            {/* password */}
            <ChangePasswrod
              label='Password'
              edit={edit}
              setEdit={setEdit}
              isEdit
              errorText={errorText}
            />

            {/*  Email Notification  */}
            <EmailNotificationsetting
              label='Email Notification'
              edit={edit}
              setEdit={setEdit}
              emailNotificationSetting={userDetail ? userDetail.email_notification_setting : null}
            />

            <FieldFormWrapper label='Linked Accounts' edit={edit} setEdit={setEdit}>
              <div className={styles.accessSettingsContainer_swtich}>
                <div className={styles.accessSettingsContainer_swtich_fb}>
                  <Text>Facebook Messenger</Text>
                  <div>{userId && <FbMessengerCheckin userRef={'account_' + userId} />}</div>
                </div>

                <Switch
                  defaultChecked={userDetail.is_fb_messenger_active}
                  onChange={(ev) => {
                    comfirmOptIn(ev)
                  }}
                />
              </div>
            </FieldFormWrapper>

            <CreditCardFrom label='Credit Card' edit={edit} setEdit={setEdit} />
          </TabPanel>

          {/* Job Alert */}
          <TabPanel value={value} index={1}>
            <Alerts accessToken={accessToken} />
          </TabPanel>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null

  if (!accessToken) {
    return {
      redirect: {
        destination: '/login/jobseeker?redirect=/dashboard/profile/settings',
        permanent: false
      }
    }
  }

  let userDetail = {}
  await accountSetting({ accessToken }).then(({ data }) => {
    userDetail = data.data
  })

  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))

  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  // const userOwnDetail = storeState.users.fetchUserOwnDetail.response
  return {
    props: {
      config,
      accessToken,
      userOwnDetail: userDetail,
      userDetail
    }
  }
})

export default AccountSettings
