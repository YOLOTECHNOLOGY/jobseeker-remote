'use client'
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from 'app/[lang]/components/MUIs'
import { LocationContext } from 'app/[lang]/components/providers/locationProvier'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextField from 'components/MaterialTextField'

import { buildQuery } from 'app/[lang]/main-page/helper'

import styles from '../../../page.module.scss'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'

const Search = () => {
  const {
    jobDetail: { content }
  } = useContext(languageContext) as any
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
        label={content.search.location}
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
        label={content.search.title}
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
        {content.search.btn}
      </Button>
    </section>
  )
}

export default Search
