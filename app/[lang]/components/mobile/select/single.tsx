/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import PopContainer from '../popContainer'
import styles from './index.module.scss'

interface MaterialSelectCheckMarksProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: string
    label?: string | React.ReactNode
    options: Array<OptionType>
    value: any
    onSelect?: any
    greyBg?: boolean
    fieldRef?: any
    error?: any
}

interface OptionType {
    value: any
    label: string | boolean
}

const SingleSelect = ({
    id,
    label,
    options,
    className,
    onSelect,
    value,
    fieldRef,
    error,
    style
}: MaterialSelectCheckMarksProps) => {
    // console.log({ value })
    const [open, setOpen] = useState(false)
    return (<FormControl fullWidth className={className} size='small'>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
            {...fieldRef}
            variant='filled'
            error={error}
            labelId={`${id}-select-label`}
            id={id}
            open={open}
            onOpen={() => setOpen(true)}
            value={value}
            style={{ ...style, background: value?.length ? '#E7F1FB' : '#F0F0F0' }}
            label={label}
            input={<OutlinedInput label='Tag' />}
            renderValue={(value: any) =>  <InputLabel
                id={`${id}-select-label`}
                style={{ color: options.find(option => option.value === value) ? '#136FD3' : undefined , overflow: 'hidden' }}
            >{
                    options.find(option => option.value === value)?.label ?? label
                }</InputLabel>}
        >
            <PopContainer
                name={label}
                onClose={() => setOpen(false)}
            >
                {options &&
                    options.map((option: any) => (
                        <MenuItem
                            selected={value === option.value}
                            key={option.value} value={option.value}
                            onClick={() => {
                                onSelect(option.value)
                                setOpen(false)
                            }}
                        >
                            <ListItemText
                                primary={option.label}
                                className={styles.lineCamp}
                                style={{
                                    color: value === option.value ? '#136FD3' : undefined
                                }}
                            />
                            {value === option.value ?
                                <div>
                                    <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.4545 2L7.14566 12L2 7" stroke="#136FD3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div> : null}
                        </MenuItem>
                    ))}
            </PopContainer>
        </Select>
    </FormControl >
    )
}

export default SingleSelect
