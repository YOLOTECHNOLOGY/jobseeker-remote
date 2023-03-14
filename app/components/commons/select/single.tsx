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
    const handleChange = (event: SelectChangeEvent) => {
        const {
            target: { value },
        } = event

        if (onSelect) {
            onSelect(value)
        }
    }
    console.log({ value }, value?.length)
    return (<FormControl fullWidth className={className} size='small'>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
            {...fieldRef}
            variant='filled'
            error={error}
            labelId={`${id}-select-label`}
            id={id}
            value={value}
            style={{ ...style, background: value?.length ? '#E7F1FB' : '#F0F0F0' }}
            label={label}
            onChange={handleChange}
            input={<OutlinedInput label='Tag' />}
        // renderValue={(value: any) => empty(value) ? <InputLabel id={`${id}-select-label`}>{label}</InputLabel> : value}
        >
            {options &&
                options.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                        <ListItemText primary={option.value} />
                    </MenuItem>
                ))}
        </Select>
    </FormControl >
    )
}

export default SingleSelect
