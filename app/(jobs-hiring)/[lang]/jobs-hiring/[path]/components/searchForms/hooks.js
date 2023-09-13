
import { useState, useTransition, useCallback } from 'react'
import useSearchHistory from 'helpers/useSearchHistory'
import { accessToken, getCookie } from 'helpers/cookies';
// import { getCountryId } from 'helpers/country';
import { fetchSearchSuggestionService } from 'store/services/jobs/fetchSearchSuggestion';
const transQs = (params) => {
    return params.map((e, index) => `query_histories[${index}]=${e}`).join('&');
}

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

    const handleSuggestionSearch = useCallback((val) => {
        transitionStart(() => {
            const valueLength = val?.length ?? 0
            if (valueLength === 0) {
                setSuggestionList(searchHistories)
            } else if (valueLength === 1) {
                setSuggestionList([])
            } else if ((val?.length ?? 0) > 1) {
                // fetch(`${process.env.JOB_BOSSJOB_URL}/search-suggestion?size=5&query=${val}&${transQs(searchHistories)}`, {
                //     headers: {
                //         'Country-Id': '' + getCountryId()
                //     }
                // })
                //     .then((resp) => resp.json())
                //     .then((data) => setSuggestionList(data.data.items))
                const qs = transObject(searchHistories)
                const token = getCookie(accessToken)
                fetchSearchSuggestionService({ size: 5, query: val, ...qs }, token)
                    .then((data) => setSuggestionList(data.data.data.items))
            }
        })
    }, [transitionStart])

    return [suggestionList, handleSuggestionSearch, addSearchHistory, loading]
}