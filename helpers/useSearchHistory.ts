import { useCallback, useEffect, useState } from "react"

export default () => {

    const [searchHistories, setSearchHistories] = useState([] as string[])
    const historyPath = 'search_history'
    useEffect(() => {
        const loadedSearchHistory = JSON.parse(localStorage.getItem(historyPath) ?? '[]')
        setSearchHistories(loadedSearchHistory)
    }, [historyPath])
    useEffect(() => {
       localStorage.setItem(historyPath, JSON.stringify(searchHistories))
    }, [searchHistories])

    const addHistory: (string) => void = useCallback(newHistory => {
        if (!newHistory?.length) {
            return
        }
        const currentIndex = searchHistories.indexOf(newHistory)
        if (currentIndex === 0) {
            return
        } else if (currentIndex > 0) {
            // if exists move to first
            const leftOthers = [...searchHistories]
            leftOthers.splice(currentIndex, 1)
            setSearchHistories([newHistory, ...leftOthers])
        } else {
            const newHistories = [newHistory, ...searchHistories]
            if (newHistories.length > 10) {
                newHistories.length = 10
            }
            setSearchHistories(newHistories)
        }

    }, [searchHistories, setSearchHistories])

    return [searchHistories, addHistory] as [string[], (string) => void]
}