
import { useState, useTransition, useCallback } from 'react'
import useSearchHistory from 'helpers/useSearchHistory'

export const useSuggest = () => {
    const [, transitionStart] = useTransition()
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
                fetch(`${process.env.JOB_BOSSJOB_URL}/suggested-search?size=5&query=${val}`)
                    .then((resp) => resp.json())
                    .then((data) => setSuggestionList(data.data.items))
            }
        })
    }, [transitionStart])

    return [suggestionList, handleSuggestionSearch,addSearchHistory]
}