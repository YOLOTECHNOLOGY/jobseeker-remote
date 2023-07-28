'use client'
import React, { useEffect } from 'react'
import styles from '../../index.module.scss'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import Tab from '@mui/material/Tab'
import MuiTabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'
import { SxProps, Theme } from '@mui/system'
import Link from 'next/link'
import Box from '@mui/material/Box'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import ModalDialog from 'components/ModalDialog'
import { setSourceCookie } from 'helpers/cookies'
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
interface headerProps {
  tabValue: string
  tabList: Array<any>
  onChange: Function
  tabChildren: Array<any>
  tabValueChildren?: string
  handleChangeChildren: Function
  loadingList: boolean
  back: string
}

const Header = ({
  tabValue,
  tabList,
  onChange,
  tabChildren,
  tabValueChildren,
  handleChangeChildren,
  loadingList,
  back
}: headerProps) => {
  const [open, setOpen] = React.useState(false)

  const handleChange = (e, newValue) => {
    onChange(newValue)
  }
  useEffect(() => {
    setSourceCookie(`${tabValue}_jobs`)
  }, [tabValue])
  const StyledTab = styled((props: StyledTabProps) => <Tab {...props} />)(({ }) => ({
    '&.Mui-selected': {
      color: '#136FD3',
      fontWeight: '700',
      minWidth: 'auto'
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
      width: '100%',
      backgroundColor: '#136FD3',
      borderRadius: '5px'
    }
  })

  return (
    <>
      <div
        className={styles.headerTop}
        style={{
          marginBottom: tabValue == 'interested' || tabValue == 'viewedMe' ? '14px' : '10px'
        }}
      >
        <Link prefetch={true} href={'/my-jobs'} className={styles.backLink}>
          <ArrowBackIosRoundedIcon className={styles.back} style={{ fontSize: '28px' }} />
          <span className={styles.bactText}>{back}</span>
        </Link>
        <span className={styles.line}>|</span>
        <Box className={styles.mobileHeaderBox}>
          <StyledTabs
            value={tabValue}
            variant='scrollable'
            scrollButtons={false}
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
                  color: '#707070',
                  fontFamily: 'product sans',
                  letterSpacing: '1px',
                  padding: '12px 0',
                  marginRight: '20px',
                  minWidth: 'auto'
                }}
              />
            ))}
          </StyledTabs>
        </Box>
        <div className={styles.mobileHeaderMask}></div>

        <ModalDialog headerTitle={'Please Select'} open={open} onClose={() => setOpen(false)}>
          <>
            {tabChildren.map((item) => (
              <div
                onClick={() => {
                  setOpen(false)
                  handleChangeChildren(item.value)
                }}
                style={{ lineHeight: '40px', fontSize: '16px' }}
                key={item.key}
              >
                {' '}
                {item.tab}{' '}
              </div>
            ))}
          </>
        </ModalDialog>
        {tabChildren?.length && (!loadingList || tabValue === 'exchanged') ? (
          <div className={styles.mobileHeaderChild} onClick={() => setOpen(true)}>
            {tabValueChildren} {loadingList} <ArrowDropDownOutlinedIcon className={styles.arrow} />
          </div>
        ) : null}
      </div>
    </>
  )
}

export default Header
