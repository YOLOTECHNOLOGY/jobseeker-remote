import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
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

const MaterialSelectCheckmarksCustomSEO = ({
  id,
  label,
  options,
  className,
  onSelect,
  greyBg,
  value,
  fieldRef,
  error,
}: MaterialSelectCheckMarksProps) => {
  const mapValueToGetDisplayValue = (val) => {
    const valueToDisplay = []
    val.forEach((v) => {
      options.forEach((option) => {
        if (option['seo-value'] === v) {
          valueToDisplay.push(option.value)
        }
      })
    })
    return valueToDisplay
  }
  
  const [selectedOptions, setSelectedOptions] = useState<any>(value || [])
  const [displayValue, setDisplayValue] = useState<Array<string>>(
    mapValueToGetDisplayValue(value)
  )

  useEffect(() => {
    setSelectedOptions(value)
    setDisplayValue(mapValueToGetDisplayValue(value))
  }, [value])

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    // On autofill we get a the stringified value.
    const formattedValue = typeof value === 'string' ? value.split(',') : value
    const valueToDisplay = []
    formattedValue.map((val) => {
      options.forEach((option) => {
        if (option.value === val) {
          valueToDisplay.push(option['seo-value'])
        }
      })
    })
    setSelectedOptions(
     formattedValue
    )
    // setDisplayValue()
    if (onSelect){
      onSelect(formattedValue)
    }
  }
  
  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            height: '48px',
            backgroundColor: greyBg ? '#E2E2E2' : 'white',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            backgroundColor: 'default',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: '13px',
            letterSpacing: '1px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            letterSpacing: '1px',
            transform: 'translate(14px, 10px) scale(1)',
            '&.Mui-focused': {
              fontSize: '10px',
              transform: 'translate(14px, -10px) scale(1)',
            },
            backgroundColor: '#fff',
            top: '4px'
          },
          shrink: {
            transform: 'translate(14px, -9px) scale(0.75)',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            letterSpacing: '1px',
          },
          input: {
            padding: '10.5px 14px !important',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <FormControl className={className} size='small'>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
          {...fieldRef}
          error={error}
          labelId={`${id}-select-label`}
          id={id}
          multiple
          value={selectedOptions}
          label={label}
          onChange={handleChange}
          input={<OutlinedInput label='Tag' />}
          renderValue={() => displayValue.join(', ')}
        >
          {options &&
            options.map((option: any) => (
              <MenuItem key={option.value} value={option['seo-value']}>
                <Checkbox
                  checked={selectedOptions.indexOf(option['seo-value']) > -1}
                  size='small'
                />
                <ListItemText primary={option.value} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}

export default MaterialSelectCheckmarksCustomSEO
