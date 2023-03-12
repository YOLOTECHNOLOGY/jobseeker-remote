'use client'
import { useEffect, useState } from 'react'

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
import styles from '../../popularJobs.module.scss'
import { SxProps, Theme } from '@mui/system'

const tabList = [
  {
    tab: 'IT',
    value: 'Information Technology'
  },
  {
    tab: 'CSR/Ops',
    value: 'Customer Service/Operations'
  },
  { tab: 'Sales', value: 'Sales' },
  { tab: 'Finance', value: 'Human Resources/Admin/Legal' },
  { tab: 'HR', value: 'Finance/Audit/Tax' },
  { tab: 'Manufacturing', value: 'Manufacturing' },
  { tab: 'Banking', value: 'Healthcare/Medical' },
  { tab: 'Healthcare', value: 'Banking' }
]

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          background: '#F5F6FA',
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
          background: '#136FD3',
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

const StyledTab = styled((props: StyledTabProps) => <Tab {...props} />)(({ }) => ({
  '&.Mui-selected': {
    color: '#136FD3'
  }
}))

const Tabs = ({ location }: any) => {
  const [value, setValue] = useState<string>('Information Technology')
  const [list, setList] = useState<Array<any>>([])
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<String>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    handleFetchPopularJobs()
  }, [value,location])

  const handleFetchPopularJobs = () => {
    setLoading(true)
    const params = {
      size: 6,
      page: 1,
      query_job_location: location,
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
    <div>
      <h2 className={styles.title}>Popular Jobs</h2>

      <div className={styles.webTab}>
        <Box sx={{ maxWidth: '100%', bgcolor: 'background.paper' }}>
          <TabContext value='1'>
            <ThemeProvider theme={theme}>
              <StyledTabs
                value={value}
                variant='scrollable'
                scrollButtons='auto'
                aria-label='scrollable auto tabs example'
                onChange={handleChange}
              >
                {tabList.map((item) => (
                  <StyledTab
                    key={item.value}
                    label={item.tab}
                    value={item.value}
                    sx={{
                      fontSize: '16px',
                      textTransform: 'capitalize',
                      width: 'calc(100% / 4)',
                      color: '#707070',
                      background: '#F5F6FA'
                    }}
                  />
                ))}
              </StyledTabs>
            </ThemeProvider>

            <div className={styles.tabContainer}>
              {!loading ? (
                list.map((item) => <JobDetail key={item.id} detail={item} />)
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
                <Button
                  variant='outlined'
                  sx={{
                    width: '118px',
                    height: '44px',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '14px',
                    lineHeight: '18px',
                    letterSpacing: '0.0075em',
                    color: '#136FD3',
                    border: '1px solid #136FD3',
                    borderRadius: '10px'
                  }}
                >
                  See more
                </Button>
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
