import React, { useEffect, useState } from 'react'

// Components
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'

/* Material Components */
import SuggestionList from './SuggestionList'

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
    fetchCompanySuggestionsService({ size: 5, query: val })
      .then((data) =>
        setSuggestionList(data.data.data.items)
      )
  }

  return (
    <div className={styles.searchField}>
      <div className={styles.searchFieldInputContainer}>
        <SuggestionList
          id='search'
          label={transitions?.companyName}
          variant='outlined'
          size='small'
          className={styles.searchField}
          searchFn={handleSuggestionSearch}
          updateSearchValue={setSearchValue}
          defaultValue={defaultQuery}
          value={searchValue}
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
      </div>

      <MaterialButton
        variant='contained'
        capitalize
        className={styles.searchFieldButton}
        onClick={() => onKeywordSearch(searchValue)}
      >
        <Text textColor='white' bold>
          {transitions?.btn}
        </Text>
      </MaterialButton>
    </div>
  )
}

export default SearchCompanyField
