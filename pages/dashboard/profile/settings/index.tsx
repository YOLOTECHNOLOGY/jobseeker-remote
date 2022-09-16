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

// mui
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Switch from '@mui/material/Switch'
import { ThemeProvider, createTheme } from '@mui/material'

// tools

// actions
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// styles
import styles from './settings.module.scss'

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

const AccountSettings = ({ userOwnDetail, config }: any) => {
  console.log(userOwnDetail)
  const refCountDownTimeName = useRef(null)

  const [value, setValue] = useState(0)
  const [edit, setEdit] = useState(null)

  const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)
  const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)

  const [emailSubscribe] = useState({
    notifications: true,
    newNotifications: false,
    careerHiringNewNotifications: true
  })

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

            {/* <FieldFormWrapper label='Password' edit={edit} setEdit={setEdit} isEdit>
              {edit === 'Password' ? (
                <div className={styles.accessSettingsContainer_fromWrapper}>
                  <Text>To receive job applications update, please verify your email.</Text>
                  <div className={styles.accessSettingsContainer_fromWrapper_edit}>
                    <div>
                      <MaterialTextField
                        className={styles.accessSettingsContainer_fromWrapper_edit_input}
                        label={requiredLabel('Current password')}
                        size='small'
                        error={passwordError ? true : false}
                        value={password.currentPassword}
                        onChange={(e) =>
                          setPassword((params) => ({
                            ...params,
                            currentPassword: e.target.value
                          }))
                        }
                        type='password'
                      />
                      {passwordError && errorText(passwordError)}

                      <MaterialTextField
                        className={styles.accessSettingsContainer_fromWrapper_edit_input}
                        label={requiredLabel('New password')}
                        size='small'
                        error={passwordError ? true : false}
                        value={password.currentPassword}
                        onChange={(e) =>
                          setPassword((params) => ({
                            ...params,
                            currentPassword: e.target.value
                          }))
                        }
                        type='password'
                      />
                      {passwordError && errorText(passwordError)}

                      <MaterialTextField
                        className={styles.accessSettingsContainer_fromWrapper_edit_input}
                        label={requiredLabel('Confirm new password')}
                        size='small'
                        error={passwordError ? true : false}
                        value={password.currentPassword}
                        onChange={(e) =>
                          setPassword((params) => ({
                            ...params,
                            currentPassword: e.target.value
                          }))
                        }
                        type='password'
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.formWrapper}>
                  <Text className={styles.bottomSpacing}>***********</Text>
                </div>
              )}
            </FieldFormWrapper> */}

            {/*  Email Notification  */}
            <FieldFormWrapper label='Email Notification' edit={edit} setEdit={setEdit}>
              <div className={styles.accessSettingsContainer_swtich}>
                <Text>Receive system notifications:</Text>
                <Switch
                  checked={emailSubscribe.careerHiringNewNotifications}
                  // onChange={(ev) => {}}
                />
              </div>
              <div className={styles.accessSettingsContainer_swtich}>
                <Text>Receive new chat notifications:</Text>
                <Switch
                  checked={emailSubscribe.careerHiringNewNotifications}
                  // onChange={(ev) => {}}
                />
              </div>
              <div className={styles.accessSettingsContainer_swtich}>
                <Text>Receive career and hiring tips newsletter:</Text>
                <Switch
                  checked={emailSubscribe.careerHiringNewNotifications}
                  // onChange={(ev) => {}}
                />
              </div>
            </FieldFormWrapper>

            <FieldFormWrapper label='Linked Accounts' edit={edit} setEdit={setEdit}>
              <div className={styles.accessSettingsContainer_swtich}>
                <Text>Facebook Messenger</Text>
                <Switch
                  checked={emailSubscribe.careerHiringNewNotifications}
                  // onChange={(ev) => {}}
                />
              </div>
            </FieldFormWrapper>

            <FieldFormWrapper label='Credit Card' edit={edit} setEdit={setEdit}>
              <CreditCardFrom />
            </FieldFormWrapper>
          </TabPanel>

          {/* Job Alert */}
          <TabPanel value={value} index={1}>
            <div className={styles.JobAlertContainer}>
              <Text tagName='h3'>Job alert</Text>
              <FieldFormWrapper label='All jobs' setEdit={setEdit} btnSuccessText='Save'>
                <Text block className={styles.JobAlertContainer_title}>
                  All location
                </Text>
                <Text block className={styles.JobAlertContainer_desc}>
                  Filters: No active filters selected
                </Text>
                <Text block className={styles.JobAlertContainer_desc}>
                  Frequency: Daily
                </Text>
              </FieldFormWrapper>
            </div>
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

  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response
  const userOwnDetail = storeState.users.fetchUserOwnDetail.response
  return {
    props: {
      config,
      accessToken,
      userOwnDetail
    }
  }
})

export default AccountSettings
