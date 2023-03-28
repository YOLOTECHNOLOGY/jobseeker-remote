'use client'
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from 'app/components/MUIs'
import { LocationContext } from 'app/components/providers/locationProvier'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextField from 'components/MaterialTextField'

import { buildQuery } from 'app/main-page/helper'

import styles from '../../../page.module.scss'

const Search = () => {
  const router = useRouter()
  const { location, setLocation } = useContext(LocationContext)

  const [searchValue, setSearchValue] = useState<string>('')

  const handleUpdatePath = () => {
    console.log(location.value, searchValue)
    const path = buildQuery(location?.value, searchValue)
    router.push(path)
  }

  return (
    <section className={styles.search}>
      <MaterialLocationField
        className={styles.search_location}
        value={location}
        isClear={false}
        defaultValue='Las Pinas'
        disableClearable
        sx={{
          fontSize: '14px',
          '> .MuiFormControl-root': {
            '> .MuiOutlinedInput-root': {
              borderRadius: '10px',

              '> .MuiOutlinedInput-notchedOutline': {
                borderColor: '#BCBCBC',
                borderWidth: '0.5px'
              }
            }
          }
        }}
        onChange={(e, value) => setLocation(value)}
      />

      <MaterialTextField
        className={styles.search_field}
        label='Job title or company'
        variant='outlined'
        size='small'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target?.value)}
        onKeyUp={(e) => e.code == 'Enter' && handleUpdatePath()}
        maxLength={60}
        sx={{
          '> .MuiOutlinedInput-root': {
            borderRadius: '10px',

            '> .MuiOutlinedInput-notchedOutline': {
              borderColor: '#BCBCBC',
              borderWidth: '0.5px'
            }
          }
        }}
      />

      <Button
        variant='contained'
        sx={{
          textTransform: 'capitalize',
          width: '119px',
          height: '44px',
          background: '#136FD3',
          borderRadius: '10px'
        }}
        onClick={handleUpdatePath}
        className={styles.search_field_bingo}
      >
        Search
      </Button>
    </section>
  )
}

export default Search
