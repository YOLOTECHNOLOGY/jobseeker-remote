'use client'
import React from 'react'
import MaterialLocationField from 'components/MaterialLocationField'
import MaterialTextFieldWithSuggestionList from 'components/MaterialTextFieldWithSuggestionList'
const SearchArea = (props: any) => {

    return <div>
        <MaterialLocationField />
        <MaterialTextFieldWithSuggestionList></MaterialTextFieldWithSuggestionList>

    </div>
}
export default SearchArea