import React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'

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
    IconComponent?: any
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
    style,
    ...rest
}: MaterialSelectCheckMarksProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        const {
            target: { value },
        } = event

        if (onSelect) {
            onSelect(value)
        }
    }
    return (<FormControl fullWidth className={className} size='small'>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
            {...fieldRef}
            {...rest}
            variant='filled'
            error={error}
            labelId={`${id}-select-label`}
            id={id}
            value={value}
            style={{ ...style, background: value?.length ? '#E7F1FB' : '#F0F0F0' }}
            label={label}
            onChange={handleChange}
            input={<OutlinedInput label='Tag' />}
            renderValue={(value: any) => {

                if (!value) {
                    return <div style={{
                        color: 'rgba(0, 0, 0, 0.6)', position: 'relative',
                        left: 13,
                        top: 2,
                    }}>{label}</div>
                } else {
                    return <div style={{
                        position: 'relative',
                        left: 13,
                        top: 2,
                    }}>{options.find(option => option.value === value).label}</div>
                }
            }}
        >
            {options &&
                options.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
        </Select>
    </FormControl >
    )
}

export default SingleSelect
