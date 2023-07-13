'use client'
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from 'app/components/MUIs'
import { LocationContext } from 'app/components/providers/locationProvier'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextField from 'components/MaterialTextField'
import SearchIcon from '@mui/icons-material/Search'

import { buildQuery } from 'app/(main-page)/helper'

import styles from '../../../page.module.scss'
import { languageContext } from 'app/components/providers/languageProvider'
import React from 'react'

const Search = () => {
  const {
    jobDetail: { content }
  } = useContext(languageContext) as any
  const router = useRouter()
  const { location, setLocation } = useContext(LocationContext)

  const [searchValue, setSearchValue] = useState<string>('')

  const handleUpdatePath = () => {
    const path = buildQuery(location?.value, searchValue)
    router.push(path)
  }

  return (
    <section className={styles.search}>
      <MaterialLocationField
        className={styles.search_location}
        value={location}
        // isClear={false}
        label={content.search.location}
        defaultValue='Las Pinas'
        disableClearable
        sx={{
          fontSize: '16px',
          '> .MuiFormControl-root': {
            '> .MuiOutlinedInput-root': {
              borderRadius: '8px',
              height: '60px',
              '> .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fff',
                borderWidth: '0.5px'
              }
            }
          }
        }}
        onChange={(e, value) => setLocation(value)}
      />
      <span className={styles.line}></span>
      <div className={styles.inputBox}>
        <MaterialTextField
          className={styles.search_field}
          label={
            <div className={styles.search_label}>
              <SearchIcon sx={{ width: '16px', height: '16px', marginRight: '3px' }} />
              <span>{content.search.title}</span>
            </div>
          }
          variant='outlined'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target?.value)}
          onKeyUp={(e) => e.code == 'Enter' && handleUpdatePath()}
          maxLength={60}
          sx={{
            fontSize: '16px',
            top: '8px',
            '> .MuiOutlinedInput-root': {
              borderRadius: '8px  0 0 8px',
              fontSize: '16px',
              '> .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fff !important',
                borderWidth: '0.5px'
              }
            },
            '> .MuiInputLabel-root': {
              fontSize: '16px'
            }
          }}
        />

        <Button
          variant='contained'
          sx={{
            textTransform: 'capitalize',
            width: '119px',
            height: '60px',
            background: '#2378E5',
            fontSize: '20px',
            borderRadius: '0px 8px 8px 0px'
          }}
          onClick={handleUpdatePath}
          className={styles.search_field_bingo}
        >
          {content.search.btn}
        </Button>
      </div>
    </section>
  )
}

export default Search
