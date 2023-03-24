"use client"
import styles from '../../index.module.scss'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import Tab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'
import { SxProps, Theme } from '@mui/system'
import Link from 'next/link';
import Box from '@mui/material/Box';
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
    tabValue: string,
    tabList: Array<any>,
    onChange: Function
    tabChildren: Array<any>,
    tabValueChildren?: string,
    handleChangeChildren: Function,
}

const Header = ({
    tabValue,
    tabList,
    onChange,
    tabChildren,
    tabValueChildren,
    handleChangeChildren,
}: headerProps) => {
    console.log(tabChildren,tabValueChildren)
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        onChange(newValue)
    }

    // const handleChangeChildrenFun = (event: React.SyntheticEvent, newValue: string) => {
    //     handleChangeChildren(newValue)
    // }

    const StyledTab = styled((props: StyledTabProps) => <Tab {...props} />)(({ }) => ({
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



    return (
        <>
            <div className={styles.headerTop}
                style={{ marginBottom: (tabValue == 'interested' || tabValue == 'viewedMe') ? '14px' : '10px' }}
            >
                <Link prefetch={false} href={"/my-job"} className={styles.backLink}>
                    <ArrowBackIosRoundedIcon className={styles.back} style={{ fontSize: '28px' }} />
                    <span className={styles.bactText}>Back</span>
                </Link>
                <span className={styles.line} >|</span>
                <Box sx={{ width: 'calc(100vw - 106px)', bgcolor: 'background.paper' }}>
                <StyledTabs
                    value={tabValue}
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
                                color: '#707070',
                                fontFamily: 'product sans',
                                letterSpacing: '1px',
                                padding: '12px 0',
                                marginRight: '30px'
                            }}
                        />
                    ))}
                </StyledTabs>
                </Box>
            </div>
       

        </>

    )
}

export default Header;