/* Vendor */
import { ThemeProvider } from '@emotion/react'

/* Components */
import { Tabs, Tab, createTheme } from '@mui/material'
import UserProfileOverview from '../UserProfileOverview'
import Text from '../Text'

/* Styles */
import styles from './ProfileLayout.module.scss'

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '50px',
        },
        centered: {
          justifyContent: 'flex-start',
          ['@media (max-width: 780px)']: {
            // eslint-disable-line no-useless-computed-key
            justifyContent: 'center',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'capitalize',
        },
      },
    },
  },
})

type ProfileLayoutProps = {
  name: string
  location?: string
  email: string
  contactNumber?: string
  avatarUrl?: string
  tabValue: string | string[]
  setTabValue: Function
  modalName: string
  handleModal: Function
  children: React.ReactNode
}

// TODO: For <Tabs> remove href comment
const ProfileLayout = ({
  name,
  location,
  email,
  contactNumber,
  children,
  tabValue,
  setTabValue,
  modalName,
  handleModal,
}: ProfileLayoutProps) => {

  const handleShowModal = () => {
    handleModal(modalName, true)
  }

  const handleTabChange = (e) => {
    let tab = e.target.childNodes[0].textContent.toLowerCase()
    tab = tab.replace(' ', '-')
    setTabValue(tab)

    /*
     * Set the tab with param: e.g: ?tab=profile.
     * Using window.history.replaceState instead of router event from useRouter as router event causes the page to rerender.
     * We only want the params to change without rerendering the page
     */
    const url = new URL(window.location as any)
    url.searchParams.set('tab', tab)
    window.history.replaceState({}, '', url)
  }

  const handleEditClick = () => {
    handleShowModal()
  }
  return (
    <div className={styles.profileLayout}>
      <div className={styles.profileLayoutUserOverview}>
        <UserProfileOverview
          name={name}
          location={location}
          email={email}
          contactNumber={contactNumber}
          handleEditClick={handleEditClick}
        />
      </div>
      <div className={styles.profileLayoutSettings}>
        <div className={styles.settingTabs}>
          <ThemeProvider theme={theme}>
            <Tabs value={tabValue} centered onChange={handleTabChange}>
              <Tab
                className={styles.settingTabsItem}
                value='profile'
                label={
                  <Text
                    bold
                    textStyle='xl'
                    textColor={tabValue === 'profile' ? 'primaryBlue' : 'black'}
                  >
                    Profile
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
                  >
                    Job Preferences
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
                  >
                    Resume
                  </Text>
                }
              />
            </Tabs>
          </ThemeProvider>
        </div>
        {children}
      </div>
    </div>
  )
}

export default ProfileLayout
