/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import PopContainer from '../popContainer'
import { flatMap } from 'lodash-es'
import { keys, mergeLeft, map, values } from 'ramda'
import styles from './index.module.scss'
interface MaterialSelectCheckMarksProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  label?: string | React.ReactNode
  labels: string[]
  options: { [key: string]: Array<OptionType> }
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

const GroupedMultipleSelect = ({
  id,
  label,
  options,
  className,
  onSelect,
  style,
  value,
  labels,
  fieldRef,
  error,
}: MaterialSelectCheckMarksProps) => {
  const [selectedOptions, setSelectedOptions] = useState<any>(mergeLeft(value)(map(() => [])(options)))
  const valueRef = useRef(value)
  useEffect(() => {
    setSelectedOptions(value)
  }, [value])
  const [open, setOpen] = useState(false)
  const handleChange = (value: string, key) => {
    const formattedValue = value.toLowerCase()
    if ((selectedOptions[key] ?? []).includes(formattedValue)) {
      setSelectedOptions({ ...selectedOptions, [key]: (selectedOptions[key] ?? []).filter(option => option !== formattedValue) })
    } else {
      setSelectedOptions({ ...selectedOptions, [key]: [...(selectedOptions[key] ?? []), formattedValue] })
    }
  }
  console.log({ selectedOptions, options })
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
        style={{ ...style, background: flatMap(values(selectedOptions), a => a || [])?.length ? '#E7F1FB' : '#F0F0F0' }}
        value={flatMap(values(selectedOptions), a => a)?.length ? flatMap(values(selectedOptions), a => a) : [label]}
        label={label}
        input={<OutlinedInput label='Tag' />}
        renderValue={() => {
          const total: number = values(selectedOptions).filter(a => a).reduce((num, arr) => num + arr.length, 0)
          if (!flatMap(values(selectedOptions), a => a || [])?.length) {
            return <div style={{
              color: 'rgba(0, 0, 0, 0.6)', 
              position: 'relative',
              // left: 13,
              top: 2,
            }}>{label}</div>
          } else {
            return <div style={{
              // color: 'rgba(0, 0, 0, 0.6)', 
              position: 'relative',
              // left: 13,
              top: 2,
            }}>{`${label} ${total > 0 ? `(${total})` : ''}`}</div>

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
          {keys(options).map((key, index) => {
            const value: any = options[key]
            return (<div key={key}>
              <div className={styles.section}>{labels[index] ?? key}</div>
              {value.map((option: any) => (
                <MenuItem key={option.value} value={option.value} onClick={() => handleChange(option.value, key)}>
                  <ListItemText className={styles.item} primary={option.label}
                    style={{
                      marginLeft: 30,
                      color: (selectedOptions[key] ?? []).indexOf(option.value?.toLowerCase()) > -1 ? '#136FD3' : '#353535'
                    }} />
                  {(selectedOptions[key] ?? []).indexOf(option.value?.toLowerCase()) > -1 ?
                    <div>
                      <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.4545 2L7.14566 12L2 7" stroke="#136FD3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div> : null}
                </MenuItem>
              ))}
            </div>)
          })}

        </PopContainer>
      </Select>
    </FormControl>
  )
}

export default GroupedMultipleSelect
