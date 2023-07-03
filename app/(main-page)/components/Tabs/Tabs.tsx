'use client'
import { useEffect, useState, useRef, useContext, useMemo } from 'react'

import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import JobDetail from '../JobDetail/JobDetail'
import { fetchPopularJobs } from 'store/services/jobs/popularJobs'
import styles from 'app/index.module.scss'
import { SxProps, Theme } from '@mui/system'
import { getCookie } from 'helpers/cookies'
import Link from 'next/link'
import {
  fetchJobsForYouLogin,
  fetchJobsPreferences
} from 'store/services/jobs/fetchJobsForYouLogin'
import { fetchJobsForYou } from 'store/services/jobs/fetchJobsForYou'
import { languageContext } from 'app/components/providers/languageProvider'
import { getValueById } from 'helpers/config/getValueById'
const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          alignItems: 'center',
          borderBottom: '0.5px solid #BCBCBC'
        },
        scrollButtons: {
          borderRadius: '50px',
          background: '#fff',
          width: '24px',
          height: '24px'
        },
        indicator: {    
          borderRadius: '5px',
          height: '3px'
        }
      }
    }
  }
})

interface StyledTabsProps {
  children?: React.ReactNode
  value: number | string
  onChange: (event: React.SyntheticEvent, newValue: number | string) => void
  variant?: 'standard' | 'scrollable' | 'fullWidth'
  scrollButtons: boolean | 'auto'
  langKey: string
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <MuiTabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))({
  '&.MuiBox-root': {
    width: '100%'
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: '87.3px',
    width: '100%',
    backgroundColor: '#136FD3',
    borderRadius: '5px'
  }
})

interface StyledTabProps {
  key: string
  label: string
  value: string
  sx: SxProps<Theme>
}

const StyledTab = styled((props: StyledTabProps) => <Tab {...props} />)(({}) => ({
  '&.Mui-selected': {
    color: '#1D2129',
    fontWeight: '700'
  },
}))

const Tabs = ({ config, location_id, langKey }: any) => {
  const { home } = useContext(languageContext) as any
  const { tab, jobTab } = home
  const tabList = useMemo(() => {
    return [
      {
        tab: tab.IT,
        value: 'Information Technology'
      },
      {
        tab: tab['CSR/Ops'],
        value: 'Customer Service/Operations'
      },
      { tab: tab['Sales'], value: 'Sales' },
      { tab: tab['Finance'], value: 'Finance/Audit/Tax' },
      { tab: tab['HR'], value: 'Human Resources/Admin/Legal' },
      { tab: tab['Manufacturing'], value: 'Manufacturing' },
      { tab: tab['Banking'], value: 'Banking' },
      { tab: tab['Healthcare'], value: 'Healthcare/Medical' }
    ]
  }, [])
  const tabListLogin = useMemo(() => {
    return [
      {
        tab: jobTab.reco,
        value: '2'
      },
      {
        tab: jobTab.latestJob,
        value: '1'
      }
    ]
  }, [])
  const [value, setValue] = useState<string>('Information Technology')
  const [list, setList] = useState<Array<any>>([])
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<String>('')
  const [loading, setLoading] = useState<boolean>(false)
  const accessToken = getCookie('accessToken')
  const user = getCookie('user')
  const [newTabList, setNewTabList] = useState<Array<any>>([])
  const jobseekerPrefIdRef = useRef(null)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (accessToken) {
      getJobseekerPref()
    } else {
      setNewTabList(tabList)
      setValue('Information Technology')
    }
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      getList()
    } else {
      handleFetchPopularJobs()
    }
  }, [value, location_id])

  const getJobseekerPref = async () => {
    const perData = await fetchJobsPreferences()
    jobseekerPrefIdRef.current = perData?.data?.data?.[0]
    if (jobseekerPrefIdRef.current) {
      setNewTabList(tabListLogin)
      setValue('2')
    } else {
      setNewTabList([])
    }
  }

  const getList = async () => {
    if (jobseekerPrefIdRef.current) {
      fetchJobsLogin()
    } else {
      fetchJobsLoginNoPerferse()
    }
  }
  const fetchJobsLogin = () => {
    if (value === '1' || value === '2') {
      setLoading(true)
      fetchJobsForYouLogin(
        {
          jobseekerPrefId: jobseekerPrefIdRef.current?.id,
          page: 1,
          size: 6,
          sort: value
        },
        accessToken
      )
        .then((res) => {
          const data = res?.data?.data?.jobs
          setList(data ?? [])
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const fetchJobsLoginNoPerferse = () => {
    setLoading(true)
    const params = {
      size: 6,
      sort: 1,
      source: 'web'
    }
    fetchJobsForYou(params)
      .then((res) => {
        const data = res?.data?.data
        setList(data.jobs ?? [])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleFetchPopularJobs = () => {
    setLoading(true)
    const params = {
      size: 6,
      page: 1,
      job_location_ids: location_id,
      main_functions: value
    }

    fetchPopularJobs(params)
      .then(({ data: data }) => {
        setList(data?.data?.jobs ?? [])
      })
      .catch((error) => {
        setMessage(error?.message ?? 'Get job list error')
        setOpen(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePopularJobSearch = (search: string) => {
    //
  }

  return (
    <div className={styles.popularJobsBox}>
      <h2 className={styles.jobTitle}>{accessToken ? home.jobCard.jobForYou : home.popularJobs}</h2>
      <div className={styles.webTab}>
        <Box sx={{ maxWidth: '100%', bgcolor: 'background.paper' ,backgroundColor:"transparent"}}>
          <TabContext value='1'>
            <ThemeProvider theme={theme}>
              <StyledTabs
                value={value}
                variant='scrollable'
                scrollButtons='auto'
                aria-label='scrollable auto tabs example'
                onChange={handleChange}
                langKey={''}
              >
                {newTabList.map((item) => (
                  <StyledTab
                    key={item.value}
                    label={item.tab}
                    value={item.value}
                    sx={{
                      fontSize: '16px',
                      textTransform: 'capitalize',
                      color: '#4E5969',
                      fontFamily: 'product sans',
                      letterSpacing: '1px',
                      width: 'auto',
                      padding: '12px 0',
                      marginRight: '68px',
                      fontWeight: '400'
                    }}
                  />
                ))}
              </StyledTabs>
              {accessToken ? (
                <div className={styles.preference}>
                  {jobseekerPrefIdRef.current ? (
                    <div>
                      {user?.avatar ? <img src={user?.avatar} /> : null}
                      {home.jobPreference}:{' '}
                      <Link
                        prefetch={false}
                        href={`${langKey}/manage-profile?tab=job-preferences`}
                        className={styles.link}
                      >
                        {getValueById(
                          config,
                          jobseekerPrefIdRef.current?.location_id,
                          'location_id'
                        )}{' '}
                        |{' '}
                        {getValueById(
                          config,
                          jobseekerPrefIdRef.current?.function_job_title_id,
                          'function_job_title_id'
                        )}{' '}
                        | {jobseekerPrefIdRef.current?.salary_range}
                      </Link>
                    </div>
                  ) : (
                    <p>
                      {home.improveRecommend}{' '}
                      <Link
                        href={`${langKey}/manage-profile?tab=job-preferences`}
                        className={styles.link2}
                      >
                        {' '}
                        {home.jobPrefer}
                      </Link>
                    </p>
                  )}
                </div>
              ) : null}
            </ThemeProvider>

            <div className={styles.tabContainer}>
              {!loading ? (
                list?.map((item) => (
                  <JobDetail config={config} langKey={langKey} key={item.id} detail={item} />
                ))
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Skeleton width={'100%'} height={200} sx={{ margin: '20px 0' }} />
                  <Skeleton width={'100%'} height={20} animation='wave' sx={{ margin: '20px 0' }} />
                  <Skeleton width={'100%'} height={20} animation='wave' sx={{ margin: '20px 0' }} />
                  <Skeleton width={'100%'} height={20} animation='wave' />
                  <Skeleton width={'100%'} height={20} animation='wave' />
                  <Skeleton width={'100%'} height={20} animation='wave' />
                  <Skeleton width={'100%'} height={20} animation='wave' />
                  <Skeleton width={'100%'} height={20} animation='wave' />
                  <Skeleton width={'100%'} height={20} animation='wave' />
                  <Skeleton width={'100%'} height={20} animation='wave' />
                </Box>
              )}

              <div className={styles.tabContainer_more}>
                <Link prefetch={false} className={styles.moreBtn} href='/my-jobs'>
                  {home.seeMoreBtn}
                </Link>
              </div>
            </div>
          </TabContext>
        </Box>
      </div>

      <div className={styles.mobileTab}>
        {tabList.map((item) => (
          <Button
            key={item.tab}
            variant='outlined'
            className={styles.mobileTab_btn}
            sx={{
              width: 'calc(50% - 5px)',
              marginBottom: '15px',
              borderColor: 'transparent',
              height: '30px',
              background: '#ffffff',
              borderRadius: '16px',
              fontWeight: '400',
              fontSize: '14px',
              alignItems: 'center',
              textAlign: 'center',
              letterSpacing: '0.0075em',
              color: '#136fd3'
            }}
            onClick={() => handlePopularJobSearch(item.value)}
          >
            {item.tab}
          </Button>
        ))}
      </div>

      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert severity='error'>{message}</Alert>
      </Snackbar>
    </div>
  )
}

export default Tabs
