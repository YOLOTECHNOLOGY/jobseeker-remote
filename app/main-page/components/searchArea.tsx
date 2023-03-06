'use client'
import React from 'react'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
import styles from './index.module.scss'
import MaterialButton from 'components/MaterialButton'
const SearchArea = (props: any) => {
    console.log({props})
    return <div className={styles.searchArea}>
        <MaterialLocationField className={styles.location} />
        <MaterialTextFieldWithSuggestionList className={styles.search} />
        <MaterialButton>Search </MaterialButton>
    </div>
}
export default SearchArea