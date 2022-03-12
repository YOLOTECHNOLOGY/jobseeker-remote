import React, { useEffect, useState, useRef } from 'react'

// Components
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'

// Styles
import styles from './SearchCompanyField.module.scss'

interface ISearchCompanyField {
  suggestions: any
  onSearch: Function
  onKeywordSearch: Function
  searchValue?: string
}

const SearchCompanyField = ({
  suggestions,
  onSearch,
  onKeywordSearch,
  searchValue
}: ISearchCompanyField) => {
  const ref = useRef(null)
  
  const [currentSuggestions, setCurrentSuggestions] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  useEffect(() => {
    if (searchValue) setValue(searchValue)
  }, [searchValue])

  useEffect(() => {
    if (suggestions) {
      if (suggestions.length > 0) setCurrentSuggestions(suggestions)
      setIsEmpty(suggestions.length === 0 ? true : false)
      setIsOpen(true)
      return
    }
    
    setIsOpen(false)
  }, [suggestions])

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) setIsOpen(false)
  }

  return (
    <div className={styles.searchField} ref={ref}>
      <div className={styles.searchFieldInputContainer}>
        <MaterialTextField
          className={styles.searchFieldInput}
          size='small'
          label='Search for Companies'
          value={value}
          onChange={(e) => {
            onSearch(e.target.value)
            setValue(e.target.value)
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onKeywordSearch((e.target as HTMLInputElement).value)
            }
          }}
        />
        {isOpen && (
          <div className={styles.searchFieldSuggestions}>
            {isEmpty && (
              <div className={styles.searchFieldSuggestionEmpty}>
                <Text textStyle='base'>No Results Found.</Text>
              </div>
            )}
            {!isEmpty && currentSuggestions.map((suggestion, i) => (
              <div 
                key={i}
                className={styles.searchFieldSuggestionItem}
                onClick={() => {
                  setValue(suggestion)
                  setIsOpen(false)
                }}
              >
                <Text textStyle='base'>{ suggestion }</Text>
              </div>
            ))}
          </div>
        )}
      </div>
      <MaterialButton variant='contained' capitalize className={styles.searchFieldButton} onClick={() => onKeywordSearch(value)}>
        <Text textColor='white' bold>Search</Text>
      </MaterialButton>
    </div>
  )
}

export default SearchCompanyField