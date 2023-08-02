import React, { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import OutlinedInput from '@mui/material/OutlinedInput'

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      overflow: 'auto'
    }
  }
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
  error
}: MaterialSelectCheckMarksProps) => {
  const [selectedOptions, setSelectedOptions] = useState<any>(value || [])
  useEffect(() => {
    setSelectedOptions(value)
  }, [value])
  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value }
    } = event
    // On autofill we get a the stringified value.
    const formattedValue = (typeof value === 'string' ? value.split(',') : value)
      .filter((item) => item !== 'emptyValue')
      .map((item) => item.toLowerCase())
    setSelectedOptions(formattedValue)
    if (onSelect) {
      onSelect(formattedValue)
    }
  }
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
        IconComponent={(props) => <ExpandMoreOutlinedIcon {...props} style={{right: '35px'}} fontSize={'small'} strokeWidth={0.3}></ExpandMoreOutlinedIcon>}
        style={{ ...style, background: value?.length ? '#E7F1FB' : '#F0F0F0' }}
        value={selectedOptions.length ? selectedOptions : ['emptyValue']}
        label={label}
        onChange={handleChange}
        input={<OutlinedInput label='Tag' />}
        placeholder={label}
        MenuProps={MenuProps}
        renderValue={(selected: any) => {
          if (selected?.[0] === 'emptyValue') {
            return (
              <div
                style={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  position: 'relative',
                  top: 2,
                  fontSize: 16
                }}
              >
                {label}
              </div>
            )
          } else {
            return (
              <div
                style={{
                  position: 'relative',
                  fontSize: 16,
                  top: 2
                }}
              >{`${label} ${selected?.length ? `(${selected.length})` : label}`}</div>
            )
          }
        }}
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
