import { useState } from 'react'
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
  currentTab?: string
  children: React.ReactNode
}

// TODO: For <Tabs> remove href comment
const ProfileLayout = ({
  name,
  location,
  email,
  contactNumber,
  children,
  currentTab,
}: ProfileLayoutProps) => {
  const [tabValue, setTabValue] = useState(currentTab)

  // eslint-disable-next-line
  const handleEditClick = () => {}
  return (
    <div className={styles.ProfileLayout}>
      <div className={styles.ProfileLayoutUserOverview}>
        <UserProfileOverview
          name={name}
          location={location}
          email={email}
          contactNumber={contactNumber}
          handleEditClick={handleEditClick}
        />
      </div>
      <div className={styles.ProfileLayoutSettings}>
        <div className={styles.SettingTabs}>
          <ThemeProvider theme={theme}>
            <Tabs
              value={tabValue}
              centered
              onChange={(e: any) => {
                const tab = e.target.childNodes[0].textContent.toLowerCase()
                setTabValue(tab)
              }}
            >
              <Tab
                className={styles.SettingTabsItem}
                value='profile'
                // href='/profile'
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
                className={styles.SettingTabsItem}
                value='job preferences'
                // href='job-preferences'
                label={
                  <Text
                    bold
                    textStyle='xl'
                    textColor={tabValue === 'job preferences' ? 'primaryBlue' : 'black'}
                  >
                    Job Preferences
                  </Text>
                }
              />
              <Tab
                className={styles.SettingTabsItem}
                value='resume'
                // href='resume'
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
