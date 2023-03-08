'use client'
import React, { useEffect } from 'react'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import styles from './index.module.scss'
import MaterialButton from 'components/MaterialButton'
import { useDispatch } from 'react-redux'
import { fetchConfigSuccess } from 'store/actions/config/fetchConfig'
const SearchArea = (props: any) => {
    console.log({ SearchArea: props })
    const { config } = props
    const dispatch = useDispatch()
    useEffect(() => {
        if (config) {
            dispatch(fetchConfigSuccess(config))
        }
    }, [config])
    return <div className={styles.searchArea}>
        <MaterialLocationField className={styles.location} />
        <MaterialTextFieldWithSuggestionList className={styles.search} />
        <MaterialButton>Search </MaterialButton>
    </div>
}
export default SearchArea