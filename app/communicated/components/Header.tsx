"use client"
import styles from '../page.module.scss'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import Tab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'
import { SxProps, Theme } from '@mui/system'

interface StyledTabsProps {
    children?: React.ReactNode
    value: number | string
    onChange: (event: React.SyntheticEvent, newValue: number | string) => void
    variant?: 'standard' | 'scrollable' | 'fullWidth'
    scrollButtons: boolean | 'auto'
}
const tabList = [
    {
        tab: 'Information Technology',
        value: 'Information Technology'
    },
    {
        tab: 'CSR/Ops',
        value: 'Customer Service/Operations'
    },
    { tab: 'Sales', value: 'Sales' },
    { tab: 'Finance', value: 'Human Resources/Admin/Legal' },
]
interface StyledTabProps {
    key: string
    label: string
    value: string
    sx: SxProps<Theme>
}

const Header = ({ value = 'Information Technology' }) => {

    const  handleChange = (e) => { 
        console.log(e)
    }

    const StyledTab = styled((props: StyledTabProps) => <Tab {...props} />)(({ }) => ({
        '&.Mui-selected': {
            color: '#136FD3',
            fontWeight:'700'
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
        <div className={styles.header}>
            <ArrowBackIosRoundedIcon className={styles.back} style={{ fontSize: '28px' }} />
            <span className={styles.bactText}>Back</span>
            <span className={styles.line} >|</span>
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
                            color: '#707070',
                            fontFamily: 'product sans',
                            letterSpacing: '1px'
                        }}
                    />
                ))}
            </StyledTabs>
        </div>
    )
}

export default Header;