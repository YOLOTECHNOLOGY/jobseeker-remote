import React, { useState, useEffect, useRef } from 'react'
import { wrapper } from 'store'
import { END } from 'redux-saga'

import Layout from 'components/Layout'
import Text from 'components/Text'
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
import { ThemeProvider, createTheme } from '@mui/material'
import { Button } from '@mui/material'

// actions
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserDetailRequest } from 'store/actions/users/fetchUserDetail'

// api
import { facebookMsgDeactivate } from 'store/services/auth/changeEmail'

// styles
import styles from './settings.module.scss'

import { getCookie } from 'helpers/cookies'
import { useDispatch, useSelector } from 'react-redux'
import useWindowDimensions from 'helpers/useWindowDimensions'
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

const AccountSettings = ({ config, accessToken }: any) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  // const refCountDownTimeName = useRef(null)

  // uid.current = id
  const uid = useRef()
  const [value, setValue] = useState(0)
  const [edit, setEdit] = useState(null)
  const [idRandom, setIdRandom] = useState(null)

  useEffect(() => {
    let id = getCookie('user')?.id
    id += '_' + new Date().getTime()
    uid.current = id
    setIdRandom(true)
  }, [])

  // const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)
  // const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)

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

  // const sendFbMessengerCheckboxEvent = (ref: number, userRef: string) => {
  //   if (typeof window !== undefined) {
  //     ;(window as any).FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, {
  //       app_id:
  //         process.env.ENV === 'production' ? '2026042927653653' : '2111002932479859',
  //       page_id:
  //         process.env.ENV === 'production' ? '307776753021449' : '638091659945858',
  //       ref: ref,
  //       user_ref: userRef
  //     })
  //   }
  // }

  // const comfirmOptIn = () => {
  //   sendFbMessengerCheckboxEvent(getCookie('user').id, 'account_' + uid.current)
  //   setTimeout(() => getInitData(), 2000)
  // }

  const unsubscribe = () => {
    facebookMsgDeactivate().then(() => {
      let id = getCookie('user')?.id
      id += '_' + new Date().getTime()
      uid.current = id
      getInitData()
    })
  }

  // const initFBCheckbox = () => {
  //   // @ts-ignore
  //   ;(window as any).FB.Event.subscribe('messenger_checkbox', function (e) {
  //     if (e.event == 'rendered') {
  //       console.log('Plugin was rendered')
  //     } else if (e.event == 'checkbox') {
  //       const checkboxState = e.state
  //       console.log('Checkbox state: ' + checkboxState)
  //       if (checkboxState === 'checked') {
  //         comfirmOptIn()
  //       }
  //     } else if (e.event == 'not_you') {
  //       console.log("User clicked 'not you'")
  //     } else if (e.event == 'hidden') {
  //       console.log('Plugin was hidden')
  //     }
  //   })
  // }

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

  return (
    <Layout>
      <div className={styles.accessSettings}>
        <div className={styles.accessSettingsTabs}>
          {width > 576 && (
            <Text tagName='h2' bold className={styles.accessSettingsTabsTitle}>
              Account Setting
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
          )}
        </div>

        <div className={styles.accessSettingsContainer}>
          <TabPanel value={value} index={0}>
            <VerifyMailAndBindEmail
              label='Email'
              edit={edit}
              setEdit={setEdit}
              isEdit
              errorText={errorText}
              emailDefault={userDetail?.email ? userDetail.email : null}
              verify={userDetail.is_email_verify}
              getInitData={getInitData}
              COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
            />

            {/*  mobile number  */}
            <VerifyPhoneNumber
              label='Mobile Number'
              edit={edit}
              setEdit={setEdit}
              isEdit
              errorText={errorText}
              phoneDefault={userDetail.phone_num ? userDetail.phone_num : null}
              verify={userDetail.is_mobile_verified}
              config={config}
              getInitData={getInitData}
              COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
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
                  <Text tagName='span'>
                    Login to your Facebook Messenger and your job application updates will be sent
                    to your Facebook Messenger.
                  </Text>
                  <div>
                    {idRandom && !userDetail.is_fb_messenger_active ? (
                      <div className={styles.accessSettingsContainer_swtich_fb_component}>
                        <FbMessengerCheckin userRef={'account_' + uid.current} />
                      </div>
                    ) : (
                      <div
                        onClick={unsubscribe}
                        className={styles.accessSettingsContainer_swtich_fb_button}
                      >
                        <Button variant='contained'>Unlink from Facebook Messenger</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FieldFormWrapper>

            {/* <CreditCardFrom label='Credit Card' edit={edit} setEdit={setEdit} /> */}
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

  // let userDetail = {}
  // await accountSetting({ accessToken }).then(({ data }) => {
  //   userDetail = data.data
  // })

  store.dispatch(fetchUserDetailRequest({ accessToken }))
  store.dispatch(fetchConfigRequest())

  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const userDetail = storeState.users.fetchUserDetail.response
  return {
    props: {
      config,
      accessToken,
      userDetail
    }
  }
})

export default AccountSettings
