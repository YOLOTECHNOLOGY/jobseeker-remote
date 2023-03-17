import React, { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
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

const MultipleSelect = ({
  id,
  label,
  options,
  className,
  onSelect,
  style,
  value,
  fieldRef,
  error,
}: MaterialSelectCheckMarksProps) => {
  const [selectedOptions, setSelectedOptions] = useState<any>(value || [])
  useEffect(() => {
    setSelectedOptions(value)
  }, [value])
  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    // On autofill we get a the stringified value.
    const formattedValue = (typeof value === 'string' ? value.split(',') : value).map(item => item.toLowerCase())
    setSelectedOptions(formattedValue)
    if (onSelect) {
      onSelect(formattedValue)
    }
  }
  console.log({ selectValue: value })
  return (
    <FormControl fullWidth className={className} size='small'>
      <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
      <Select
        {...fieldRef}
        variant='filled'
        error={error}
        labelId={`${id}-select-label`}
        id={id}
        multiple
        style={{ ...style, background: value?.length ? '#E7F1FB' : '#F0F0F0' }}
        value={selectedOptions}
        label={label}
        onChange={handleChange}
        input={<OutlinedInput label='Tag' />}
        renderValue={(selected: any) => `${label} ${selected?.length ? `(${selected.length})` : ''}`}
      >
        {options &&
          options.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                checked={selectedOptions.indexOf(option.value?.toLowerCase()) > -1}
                size='small'
              />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

export default MultipleSelect
