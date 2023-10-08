/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import PopContainer from '../popContainer'
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
  menuClassName?: any
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
  menuClassName = ''
}: MaterialSelectCheckMarksProps) => {
  const [selectedOptions, setSelectedOptions] = useState<any>(value || [])
  useEffect(() => {
    setSelectedOptions(value)
  }, [value])
  const valueRef = useRef(value)

  const [open, setOpen] = useState(false)
  const handleChange = (value: string) => {
    const formattedValue = value.toLowerCase()
    if (selectedOptions.includes(formattedValue)) {
      setSelectedOptions(selectedOptions.filter(option => option !== formattedValue))
    } else {
      setSelectedOptions([...selectedOptions, formattedValue])
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
        open={open}
        autoFocus={false}
        onOpen={() => setOpen(true)}
        style={{ ...style, background: selectedOptions?.length ? '#E7F1FB' : '#F0F0F0' }}
        value={selectedOptions.length ? selectedOptions : [label]}
        label={label}
        // onChange={handleChange}
        input={<OutlinedInput label='Tag' />}
        renderValue={(selected: any) => {
          if (selectedOptions?.length) {
            return <div style={{
              position: 'relative',
              top: 2,
            }}>{`${label} (${selected.length})`}
            </div>
          } else {
            return <div style={{
              color: 'rgba(0, 0, 0, 0.6)',
              position: 'relative',
              top: 2,
            }}>{label}</div>
          }
        }}
      >
        <PopContainer
          name={label}
          multiple
          onClose={() => {
            setSelectedOptions(valueRef.current)
            setOpen(false)
          }}
          onSave={() => {
            onSelect(selectedOptions)
            valueRef.current = selectedOptions
            setOpen(false)
          }}
          onReset={() => setSelectedOptions([])}
        >
          {options &&
            options.map((option: any) => (
              <MenuItem key={option.value} value={option.value} onClick={() => handleChange(option.value)}>

                <ListItemText primary={option.label}
                  style={{
                    color: selectedOptions?.indexOf?.(option.value?.toLowerCase()) > -1 ? '#136FD3' : undefined
                  }} />
                {selectedOptions?.indexOf?.(option.value?.toLowerCase()) > -1 ?
                  <div>
                    <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.4545 2L7.14566 12L2 7" stroke="#136FD3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div> : null}
              </MenuItem>
            ))}
        </PopContainer>
      </Select>
    </FormControl>
  )
}

export default MultipleSelect
