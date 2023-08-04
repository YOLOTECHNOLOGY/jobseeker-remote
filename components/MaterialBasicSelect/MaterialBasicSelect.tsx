import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { FormHelperText } from '@mui/material'
import styles from 'styles/maintenance.module.scss'
import classNames from 'classnames'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MaterialBasicSelect = ({
  id,
  label,
  options,
  className,
  onSelect,
  onOpen,
  greyBg,
  defaultValue,
  fieldRef,
  disabled,
  required,
  error,
  useID = false,
  hiddenLabel = false,
  ...rest
}: any) => {
  const [value, setValue] = useState(defaultValue || '1')

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string)
    if (onSelect) {
      onSelect(event.target.value)
    }
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 8 + ITEM_PADDING_TOP,
        overflow: 'auto'
      }
    }
  }

  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            transform: 'translate(14px, 10px) scale(1)',
            letterSpacing: '1px',
            '&.Mui-focused': {
              fontSize: '10px',
              transform: 'translate(14px, -10px) scale(1)'
            },
            lineHeight: '26px'
          },
          shrink: {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)'
          },
          outlined: {
            '&.MuiInputLabel-shrink': {
              fontSize: '10px'
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            height: '44px',
            backgroundColor: greyBg ? '#E2E2E2' : 'white',
            lineHeight: '16px',
            alignItems: 'self-end'
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontSize: '14px',
            letterSpacing: '1px'
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '16px',
            letterSpacing: '1px',
            padding: '10px 16px'
          }
        }
      }
    }
  })
  return (
    <ThemeProvider theme={theme}>
      <FormControl className={classNames({
        [className]: true,
        [styles.hiddenLabel]: hiddenLabel
      })} size='small' error={!!error}>
        <InputLabel id={`${id}-select-label`} 
          // className={'testInput'}
        >
          {
            <span>
              {label} {required ? <span style={{ color: 'red' }}>{' *'}</span> : ''}
            </span>
          }
        </InputLabel>
        <Select
          {...fieldRef}
          labelId={`${id}-select-label`}
          id={id}
          value={value}
          label={label}
          onChange={handleChange}
          onOpen={onOpen}
          disabled={disabled}
          helpertext={error?.message}
          MenuProps={MenuProps}
          {...rest}
        >
          {options &&
            options.map((option) => (
              <MenuItem key={option.value} value={useID ? option.id : option.value}>
                {option.label}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>{error?.message}</FormHelperText>
      </FormControl>
    </ThemeProvider>
  )
}
export default MaterialBasicSelect
