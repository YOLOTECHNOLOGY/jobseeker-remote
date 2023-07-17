'use client'
import React, { useContext } from 'react'
import styles from './sort.module.scss'
import Tab from '@mui/material/Tab'
import MuiTabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'
import { SxProps, Theme } from '@mui/system'
import { SortContext } from './SortProvider'
interface StyledTabsProps {
  children?: React.ReactNode
  value: number | string
  onChange: (event: React.SyntheticEvent, newValue: number | string) => void
  variant?: 'standard' | 'scrollable' | 'fullWidth'
  scrollButtons: boolean | 'auto'
}

interface StyledTabProps {
  key: string
  label: string
  value: string
  sx: SxProps<Theme>
}

type sortProps = {
  lang: any
}

const SortFilter = ({ lang }: sortProps) => {
  const tab = [
    {
      tab: lang.recommended,
      value: '2'
    },
    {
      tab: lang.latestJob,
      value: '1'
    }
  ]
  const StyledTab = styled((props: StyledTabProps) => <Tab {...props} />)(({}) => ({
    '&.Mui-selected': {
      color: '#136FD3',
      fontWeight: '700'
    }
  }))

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
  const { sort, handleChange } = useContext(SortContext)
  return (
    <div className={styles.sortBox}>
      <StyledTabs
        value={sort}
        variant='scrollable'
        scrollButtons='auto'
        aria-label='scrollable auto tabs example'
        onChange={handleChange}
      >
        {tab.map((item) => (
          <StyledTab
            key={item.value}
            label={item.tab}
            value={item.value}
            sx={{
              fontSize: '16px',
              textTransform: 'capitalize',
              color: '#707070',
              fontFamily: 'product sans',
              letterSpacing: '1px',
              padding: '12px 0',
              marginRight: '36px'
            }}
          />
        ))}
      </StyledTabs>
    </div>
  )
}

export default SortFilter
