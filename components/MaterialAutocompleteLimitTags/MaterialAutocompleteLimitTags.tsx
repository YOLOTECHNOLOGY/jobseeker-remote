import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

interface MaterialAutoCompleteLimitTagsProps {
  //   children?: React.ReactNode
  style?: React.CSSProperties
  id: string
  limitTagCount: number
  options: Array<OptionType>
  ref?: any
  className?: string
  defaultValue?: any
  onChange: Function
  //   label?: string
}

type OptionType = {
  value: string
  label: string | boolean
};

const MaterialAutocompleteLimitTags = ({
  id,
  options,
  limitTagCount,
  defaultValue,
  style,
  onChange,
  ...rest
}: MaterialAutoCompleteLimitTagsProps) => {
  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          tag: {
            height: '20px',
          },
          input:{
            fontSize:'13px'
          }
        },
      },
      MuiChip: {
        styleOverrides: {
          deleteIcon: {
            height: '16px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            // fontSize: '13px',
            lineHeight: '1rem',
          },
        },
      },
    },
  })

  // console.log('MaterialAutoCompleteLimitTags options', options)

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        multiple
        limitTags={limitTagCount}
        id={id}
        options={options}
        getOptionLabel={(option) => option.value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>,
          value
        ): void => onChange(e, value)}
        defaultValue={defaultValue}
        renderInput={(params) => (
          <TextField
            {...params}
            size='small'
            label='Specialization'
            placeholder='Choose specialization'
          />
        )}
        style={style}
        {...rest}
      />
    </ThemeProvider>
  )
}

export default MaterialAutocompleteLimitTags
