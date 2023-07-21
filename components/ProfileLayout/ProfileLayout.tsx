/* Vendor */
import { ThemeProvider } from '@emotion/react'

/* Components */
import { Tabs, Tab, createTheme } from '@mui/material'
import UserProfileOverview from 'components/UserProfileOverview'
import Text from 'components/Text'
import Image from 'next/image';

/* Styles */
import styles from './ProfileLayout.module.scss'

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '50px'
        },
        centered: {
          justifyContent: 'flex-start',
          ['@media (max-width: 780px)']: {
            // eslint-disable-line no-useless-computed-key
            justifyContent: 'center'
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'capitalize'
        }
      }
    }
  }
})

type ProfileLayoutProps = {
  userDetail: any
  tabValue: string | string[]
  setTabValue: Function
  modalName: string
  handleModal: Function
  children: React.ReactNode
  dic: any
  unCompleted: any
}

const ProfileLayout = ({
  dic,
  userDetail,
  tabValue,
  setTabValue,
  modalName,
  handleModal,
  children,
  unCompleted
}: ProfileLayoutProps) => {
  const {
    avatar,
    email,
    phone_num: contactNum,
    first_name: firstName,
    last_name: lastName,
    location: userLocation,
    description,
    xp_lvl: expLevel,
    birthdate,
    working_since,
    address
  } = userDetail

  const handleShowModal = () => {
    handleModal(modalName, true)
  }

  const handleTabChange = (e, target) => {
    setTabValue(target)
    /*
     * Set the tab with param: e.g: ?tab=profile.
     * Using window.history.replaceState instead of router event from useRouter as router event causes the page to rerender.
     * We only want the params to change without rerendering the page
     */
    const url = new URL(window.location as any)
    url.searchParams.set('tab', target)
    window.history.replaceState({}, '', url)
  }

  const handleEditClick = () => {
    handleShowModal()
  }
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageBanner}>
        <Image src={`${process.env.S3_BUCKET_URL}/profile/banner2.png`} style={{objectFit: 'cover'}} fill alt='banner'></Image>
      </div>
      <div className={styles.profileLayout}>
        <div className={styles.profileLayoutUserOverview}>
          <UserProfileOverview
            name={`${firstName} ${lastName}`}
            location={userLocation}
            email={email}
            avatarUrl={avatar}
            contactNumber={contactNum}
            description={description}
            expLevel={expLevel}
            birthdate={birthdate}
            working_since={working_since}
            address={address}
            handleEditClick={handleEditClick}
            lang={dic}
          />
        </div>
        <div className={styles.profileLayoutSettings}>
          <div className={styles.settingTabs}>
            <ThemeProvider theme={theme}>
              <Tabs
                value={tabValue}
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleTabChange}
              >
                <Tab
                  className={styles.settingTabsItem}
                  value='profile'
                  label={
                    <Text
                      bold
                      textStyle='xl'
                      textColor={tabValue === 'profile' ? 'primaryBlue' : 'black'}
                      className={unCompleted['profile'] ? styles.unCompleted : ''}
                    >
                      {dic.profile.tabTitle}
                    </Text>
                  }
                />
                <Tab
                  className={styles.settingTabsItem}
                  value='job-preferences'
                  label={
                    <Text
                      bold
                      textStyle='xl'
                      textColor={tabValue === 'job-preferences' ? 'primaryBlue' : 'black'}
                      className={unCompleted['job-preferences'] ? styles.unCompleted : ''}
                    >
                      {dic.preference.tabTitle}
                    </Text>
                  }
                />
                <Tab
                  className={styles.settingTabsItem}
                  value='resume'
                  label={
                    <Text
                      bold
                      textStyle='xl'
                      textColor={tabValue === 'resume' ? 'primaryBlue' : 'black'}
                      className={unCompleted['resume'] ? styles.unCompleted : ''}
                    >
                      {dic.resume.tabTitle}
                    </Text>
                  }
                />
              </Tabs>
            </ThemeProvider>
          </div>
          {children}
        </div>
      </div>
    </div>

  )
}

export default ProfileLayout
