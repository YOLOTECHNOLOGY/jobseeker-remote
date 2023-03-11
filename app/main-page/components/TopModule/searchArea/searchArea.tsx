'use client'
import React, { useEffect, useState, useTransition, useCallback,useContext } from 'react'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import styles from './index.module.scss'
import MaterialButton from 'components/MaterialButton'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
import useSearchHistory from 'helpers/useSearchHistory'
import { useRouter } from 'next/navigation'
import { buildQuery } from '../../../helper'
import {LocationContext} from '../../../../components/providers/locationProvier'
const SearchArea = (props: any) => {
    console.log({props})
    const { config } = props
    const dispatch = useDispatch()
    const {location,setLocation} = useContext(LocationContext)
    const router = useRouter()

    const pushJobPage = useCallback((value) => {
        const query = buildQuery(location?.seo_value, value)
        router.push(query, { forceOptimisticNavigation: true })
    }, [location, router])

    const [suggestionList, setSuggestionList] = useState([])
    useEffect(() => {
        if (config) {
            dispatch(fetchConfigSuccess(config))
        }
    }, [config])
    const [searchValue, setSearchValue] = useState('')
    const [searchHistories, addSearchHistory] = useSearchHistory()
    const [, transitionStart] = useTransition()
    const handleSuggestionSearch = useCallback((val) => {
        transitionStart(() => {
            const valueLength = val?.length ?? 0
            if (valueLength === 0) {
                setSuggestionList(searchHistories as any)
            } else if (valueLength === 1) {
                setSuggestionList([])
            } else if ((val?.length ?? 0) > 1) {
                fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
                    .then((resp) => resp.json())
                    .then((data) => setSuggestionList(data.data.items))
            }
        })
    }, [transitionStart])
    return <div className={styles.searchArea}>
        <MaterialLocationField
            className={styles.location}
            value={location}
            isClear={false}
            defaultValue="Las Pinas"
            disableClearable
            onChange={(e, value) => setLocation(value)}
        />
        <MaterialTextFieldWithSuggestionList
            id='search'
            label='Search for job title or company name'
            variant='outlined'
            size='small'
            className={styles.search}
            // defaultValue={defaultValues?.urlQuery}
            value={searchValue}
            maxLength={255}
            searchFn={handleSuggestionSearch}
            updateSearchValue={setSearchValue}
            onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    setSearchValue((e.target as HTMLInputElement).value)
                    addSearchHistory((e.target as HTMLInputElement).value)
                    pushJobPage((e.target as HTMLInputElement).value)
                }
            }}
            options={suggestionList}
            onSelect={(value: any) => {
                setSearchValue(value)
                addSearchHistory(value)
                pushJobPage(value)
            }}
        />
        <MaterialButton
            className={styles.searchButton} disabled={!searchValue}
            onClick={() => {
                addSearchHistory(searchValue)
                pushJobPage(searchValue)
            }}
        > Search </MaterialButton>
    </div>
}
export default SearchArea