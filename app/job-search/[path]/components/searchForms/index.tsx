'use client'
import React, { useState, useContext } from 'react'
import LocationField from 'app/components/commons/location'
import JobSearchBar from '../../../../components/commons/location/search'
import styles from './index.module.scss'
import MaterialButton from 'components/MaterialButton'
import { useSuggest } from './hooks'
// import { useRouter } from 'next/navigation'
import { LocationContext } from '../../../../components/providers/locationProvier'
const SearchArea = (props: any) => {
    const { config } = props
    const { location, setLocation } = useContext(LocationContext)
    // const router = useRouter()
    const [searchValue, setSearchValue] = useState('')
    const [suggestionList, handleSuggestionSearch, addSearchHistory] = useSuggest() as any[]
    console.log({ location })
    return <div className={styles.searchArea}>
        <LocationField
            className={styles.location}
            locationList={config.inputs.location_lists}
            value={location}
            isClear={true}
            defaultValue={location}
            // disableClearable
            onChange={(e, value) => setLocation(value)}
        />
        <JobSearchBar
            id='search'
            label='Search for job title or company name'
            variant='outlined'
            size='small'
            className={styles.search}
            value={searchValue}
            maxLength={255}
            searchFn={handleSuggestionSearch as any}
            updateSearchValue={setSearchValue}
            onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    setSearchValue((e.target as HTMLInputElement).value)
                    addSearchHistory((e.target as HTMLInputElement).value)
                }
            }}
            options={suggestionList}
            onSelect={(value: any) => {
                setSearchValue(value)
                addSearchHistory(value)
            }}
        />
        <MaterialButton
            className={styles.searchButton} disabled={!searchValue}
            onClick={() => {
                addSearchHistory(searchValue)
            }}
        > Search </MaterialButton>
    </div>
}
export default SearchArea