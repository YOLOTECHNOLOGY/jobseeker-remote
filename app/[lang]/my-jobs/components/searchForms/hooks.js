
import { useState, useTransition, useCallback } from 'react'
import useSearchHistory from 'helpers/useSearchHistory'
import { accessToken, getCookie } from 'helpers/cookies'
import { fetchSearchSuggestionService } from 'store/services/jobs/fetchSearchSuggestion'
// import { getCountryId } from 'helpers/country';

const transObject = (params) => {
    const result = {}
    params.forEach((e, index) => {
        result[`query_histories[${index}]`] = e
    });
    return result
  }

export const useSuggest = () => {
    const [loading, transitionStart] = useTransition()
    const [suggestionList, setSuggestionList] = useState([])
    const [searchHistories, addSearchHistory] = useSearchHistory()
    const token = getCookie(accessToken)

    const handleSuggestionSearch = useCallback((val) => {
        transitionStart(() => {
            const valueLength = val?.length ?? 0
            if (valueLength === 0) {
                setSuggestionList(searchHistories)
            } else if (valueLength === 1) {
                setSuggestionList([])
            } else if ((val?.length ?? 0) > 1) {
                // fetch(`${process.env.JOB_BOSSJOB_URL}/search-suggestion?size=5&query=${val}`,{
                //     headers:{
                //         'Country-Id':'' + getCountryId()
                //       } 
                // })
                //     .then((resp) => resp.json())
                //     .then((data) => setSuggestionList(data.data.items))
                fetchSearchSuggestionService({ size: 5, query: val },token)
                    .then((data) => setSuggestionList(data.data.data.items))
            }
        })
    }, [transitionStart])

    return [suggestionList, handleSuggestionSearch, addSearchHistory, loading]
}