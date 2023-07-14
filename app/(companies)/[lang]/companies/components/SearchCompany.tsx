import React, { useEffect, useState } from 'react'

/* Components */
import theme from 'app/components/commons/theme'
import { ThemeProvider } from '@mui/material/styles'
import JobSearchBar from 'app/components/commons/location/search'

// Styles
import styles from '../Companies.module.scss'
import { fetchCompanySuggestionsService } from 'store/services/companies2/fetchCompanySuggestions'

interface ISearchCompanyField {
  defaultQuery?: string
  onKeywordSearch: Function
  clearSearchRef?: any
  transitions: Record<string, any>
}

const SearchCompanyField = ({
  defaultQuery = '',
  onKeywordSearch,
  transitions,
  clearSearchRef
}: ISearchCompanyField) => {
  const [suggestionList, setSuggestionList] = useState([])
  const [searchValue, setSearchValue] = useState('')

  clearSearchRef.current = () => {
    setSearchValue('')
  }

  useEffect(() => {
    if (searchValue) setSearchValue(searchValue)
  }, [searchValue])

  const handleSuggestionSearch = (val) => {
    fetchCompanySuggestionsService({ size: 5, query: val }).then((data) =>
      setSuggestionList(data.data.data.items)
    )
  }

  return (
    <div className={styles.searchField}>
      <div className={styles.searchFieldInputContainer}>
        <ThemeProvider theme={theme}>
          <JobSearchBar
            id='companies-search-input'
            label={transitions?.companyName}
            variant='outlined'
            size='small'
            className={styles.searchField}
            maxLength={255}
            searchFn={handleSuggestionSearch}
            updateSearchValue={setSearchValue}
            defaultValue={defaultQuery}
            value={searchValue}
            renderOption={(props, option) => {
              return (
                <li {...props} key={props.id}>
                  <span style={{ fontSize: '16px' }}>{option}</span>
                </li>
              )
            }}
            onSelect={(val: any) => {
              setSearchValue(val)
              onKeywordSearch(val)
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                setSuggestionList([])
                onKeywordSearch(searchValue)
              }
            }}
            options={suggestionList}
          />
        </ThemeProvider>
      </div>

      <button className={styles.searchFieldButton} onClick={() => onKeywordSearch(searchValue)}>
        {transitions?.btn}
      </button>
    </div>
  )
}

export default SearchCompanyField
