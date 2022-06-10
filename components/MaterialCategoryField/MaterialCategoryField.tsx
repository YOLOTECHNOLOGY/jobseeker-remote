/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'

/* MUI components */
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import OutlinedInput from '@mui/material/OutlinedInput'

/* Helpers */
import { useFirstRender } from 'helpers/useFirstRender'

interface MaterialCategoryField extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  label?: string | React.ReactNode
  options?: Array<MainOptionType>
  value: any
  list: any
  onSelect?: any
  isReset?: boolean
  greyBg?: boolean
  fieldRef?: any
  error?: any
}

interface MainOptionType {
  id: Number
  sort_order: Number
  sub_list: Array<SubListOptionType>
  key: string
  value: string
}

interface SubListOptionType {
  id: Number
  key: string
  value: string
}

const MaterialCategoryField = ({
  id,
  label,
  options,
  className,
  onSelect,
  greyBg,
  value,
  list,
  isReset,
  fieldRef,
  error,
}: MaterialCategoryField) => {
  const firstRender = useFirstRender()
  const initialListOptions = options.map((data) => {
    const newSubList = data.sub_list.map((subData) => ({
      ...subData,
      isChecked: false,
    }))
    const newList = {
      ...data,
      isChecked: false,
      sub_list: newSubList,
    }
    return newList
  })

  const [listOptions, setListOptions] = useState(
    list && list.length > 0 ? list : initialListOptions
  )
  const [displayValue, setDisplayValue] = useState<Array<string>>([''])

  useEffect(() => {
    const selectedOptions = []
    const valueToDisplay = []
    if (!isReset) {
      listOptions.map((option) => {
        if (option.isChecked) {
          valueToDisplay.push(option.value)
          selectedOptions.push(option['seo-value'])
        } else {
          option?.sub_list?.map((subOption) => {
            if (subOption.isChecked) {
              valueToDisplay.push(subOption.value)
              selectedOptions.push(subOption['seo-value'])
            }
          })
        }
      })
      setDisplayValue(valueToDisplay)
      if (
        !firstRender &&
        ((value && value.length > 0) || (selectedOptions && selectedOptions.length > 0))
      )
        onSelect(selectedOptions)
    }
  }, [listOptions])

  useEffect(() => {
    if (isReset) {
      setDisplayValue([])
      setListOptions(initialListOptions)
    }
  }, [isReset])

  const onMainSelection = (e, optionData) => {
    /* find the corresponding option data based on option['seo-value'] && 
    update the corresponding option data with new isChecked value */
    const data = listOptions.map((data) => {
      let newData = { ...data }
      if (data['seo-value'] === optionData['seo-value']) {
        const newSubList = data.sub_list.map((data) => {
          return {
            ...data,
            isChecked: e.target.checked,
          }
        })
        newData = {
          ...newData,
          isChecked: e.target.checked,
          sub_list: newSubList,
        }
      }
      return newData
    })

    setListOptions(data)
  }

  const onSubSelection = (e, optionData) => {
    /* find the corresponding parent option data based on option['seo-value'] && 
    update the corresponding parent and sub option data with new isChecked value */
    const data = listOptions.map((data) => {
      let newData = { ...data }
      const newSubList = data.sub_list.map((subListData) => {
        // if checked === true, set subOption isChecked = true
        if (e.target.checked) {
          if (subListData['seo-value'] === optionData['seo-value']) {
            return {
              ...subListData,
              isChecked: true,
            }
          } else {
            return {
              ...subListData,
            }
          }
        } else {
          // if checked === false, set subOption isChecked = false
          if (subListData['seo-value'] === optionData['seo-value']) {
            return {
              ...subListData,
              isChecked: false,
            }
          } else {
            // if main option isChecked is true, set all other option's isChecked = true
            if (data.isChecked) {
              return {
                ...subListData,
                isChecked: true,
              }
            } else {
              return {
                ...subListData,
              }
            }
          }
        }
      })
      newData = {
        ...newData,
        // if sub option is deselected, deselect main option as well
        isChecked: !e.target.checked ? e.target.checked : newData.isChecked,
        sub_list: newSubList,
      }
      return newData
    })

    setListOptions(data)
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
      MuiMenu: {
        styleOverrides: {
          root: {
            maxHeight: '350px',
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
            top: '4px',
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
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            width: '100%',
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
          value={value}
          label={label}
          input={<OutlinedInput label='Tag' />}
          renderValue={() => displayValue.join(', ')}
        >
          {listOptions &&
            listOptions.map((option) => {
              const subListOptions = option.sub_list
              return [
                <MenuItem
                  key={option.id}
                  value={option['seo-value']}
                  sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.6)' }}
                >
                  <FormControlLabel
                    label={option.value}
                    control={
                      <Checkbox
                        indeterminate={option.isChecked}
                        checked={option.isChecked}
                        size='small'
                        onChange={(e) => onMainSelection(e, option)}
                      />
                    }
                  />
                </MenuItem>,
                subListOptions?.map((subOption) => {
                  return (
                    <MenuItem
                      key={subOption.id}
                      value={subOption['seo-value']}
                      sx={{ fontWeight: 'bold', paddingLeft: '40px' }}
                    >
                      <FormControlLabel
                        label={subOption.value}
                        control={
                          <Checkbox
                            checked={subOption.isChecked}
                            size='small'
                            onChange={(e) => onSubSelection(e, subOption)}
                          />
                        }
                      />
                    </MenuItem>
                  )
                }),
              ]
            })}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}

export default MaterialCategoryField
