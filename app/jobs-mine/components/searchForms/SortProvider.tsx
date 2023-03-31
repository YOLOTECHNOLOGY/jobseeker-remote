"use client"
import React, { useState, createContext } from 'react';
import styles from './index.pc.module.scss'
import Tab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'
import { SxProps, Theme } from '@mui/system'
export const SortContext = createContext({sort:'1', setSort:  null});
const Provider = SortContext.Provider

interface StyledTabsProps {
    children?: React.ReactNode
    value: number | string
    onChange: (event: React.SyntheticEvent, newValue: number | string) => void
    variant?: 'standard' | 'scrollable' | 'fullWidth'
    scrollButtons: boolean | 'auto'
}

const tab = [
    {
        tab: 'Recommended',
        value: '1',
     },
     {
        tab: 'Latest job',
        value: '2',
     }
]

interface StyledTabProps {
    key: string
    label: string
    value: string
    sx: SxProps<Theme>
}


const SortProvider = ({children}) => {

    const [sort, setSort] = useState('1')
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSort(newValue)
    }

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

    return  <Provider value={{ sort,setSort:setSort}}>
            {children}
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
        </Provider>
    
}

export default SortProvider;