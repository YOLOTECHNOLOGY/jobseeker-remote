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

import JobDetail from '../JobDetail/JobDetail'

import { fetchPopularJobs } from 'store/services/jobs/popularJobs'

import styles from '../../popularJobs.module.scss'

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

const Tabs = () => {
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
  }, [value])

  const handleFetchPopularJobs = () => {
    setLoading(true)
    const params = {
      size: 6,
      page: 1,
      query_job_location: 'Manila',
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

  return (
    <div>
      <Box sx={{ maxWidth: '100%', bgcolor: 'background.paper' }}>
        <TabContext value='1'>
          <ThemeProvider theme={theme}>
            <MuiTabs
              value={value}
              variant='scrollable'
              scrollButtons='auto'
              aria-label='scrollable auto tabs example'
              onChange={handleChange}
            >
              {tabList.map((item) => (
                <Tab
                  key={item.value}
                  label={item.tab}
                  value={item.value}
                  sx={{
                    fontSize: '16px',
                    textTransform: 'capitalize',
                    width: 'calc(100% / 4)',
                    color: '#136FD3',
                    background: '#F5F6FA'
                  }}
                />
              ))}
            </MuiTabs>
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
          </div>
        </TabContext>
      </Box>

      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert severity='error'>{message}</Alert>
      </Snackbar>
    </div>
  )
}

export default Tabs
