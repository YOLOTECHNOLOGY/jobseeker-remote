'use client'
import { useEffect, useContext } from 'react'

import { LocationContext } from 'app/components/providers/locationProvier'
import { Button } from 'app/components/MUIs'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'

import styles from '../../../page.module.scss'

const Search = () => {
  const { location, setLocation } = useContext(LocationContext)

  useEffect(() => {
    console.log(location, 'locationslocationslocations')
  }, [location])

  return (
    <section className={styles.search}>
      <MaterialLocationField
        className={styles.search_location}
        value={location}
        isClear={false}
        defaultValue='Las Pinas'
        disableClearable
        style={{
          fontSize: '14px'
        }}
        onChange={(e, value) => setLocation(value)}
      />

      <MaterialTextFieldWithSuggestionList
        className={styles.search_field}
        label='Job title or company'
        variant='outlined'
        size='small'
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
      >
        Search
      </Button>
    </section>
  )
}

export default Search
