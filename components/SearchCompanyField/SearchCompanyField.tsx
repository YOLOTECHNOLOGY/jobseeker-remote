import React, { useEffect, useState, useRef } from 'react'

// Components
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'

/* Material Components */
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'

// Styles
import styles from './SearchCompanyField.module.scss'
import { fetchCompanySuggestionsService } from 'store/services/companies2/fetchCompanySuggestions'

interface ISearchCompanyField {
  defaultQuery?: string
  onKeywordSearch: Function
  transitions: Record<string, any>
}

const SearchCompanyField = ({
  defaultQuery = '',
  onKeywordSearch,
  transitions
}: ISearchCompanyField) => {
  const ref = useRef(null)

  const [suggestionList, setSuggestionList] = useState([])
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (searchValue) setSearchValue(searchValue)
  }, [searchValue])

  const handleSuggestionSearch = (val) => {
    fetchCompanySuggestionsService({ size: 5, query: val })
      // fetch(`${process.env.COMPANY_URL}/search-suggestion?size=5&query=${val}`)
      // .then((resp) => resp.json())
      .then((data) =>
        setSuggestionList(data.data.data.items)
      )
  }

  return (
    <div className={styles.searchField} ref={ref}>
      <div className={styles.searchFieldInputContainer}>
        <MaterialTextFieldWithSuggestionList
          id='search'
          label={transitions?.companyName}
          variant='outlined'
          size='small'
          className={styles.searchField}
          searchFn={handleSuggestionSearch}
          updateSearchValue={setSearchValue}
          defaultValue={defaultQuery}
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
