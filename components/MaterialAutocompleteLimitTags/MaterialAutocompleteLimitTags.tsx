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
          input: {
            fontSize: '13px',
          },
          option:{
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
            fontSize: '14px',
            letterSpacing: '1px',
          },
          shrink: {
            fontSize: '10px',
            transform: 'translate(14px, -10px) scale(1)',
          },
          outlined: {
            '&.MuiInputLabel-shrink': {
              fontSize: '10px',
            },
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
        // inputValue={(a)=>console.log('a', a)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>, value): void => onChange(e, value)}
        defaultValue={defaultValue}
        //   defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
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
