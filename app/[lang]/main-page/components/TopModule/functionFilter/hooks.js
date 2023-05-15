import { useState, useMemo, useCallback, useEffect } from "react"


export const usePageGrouped = (list = []) => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = useMemo(() => {
        return  Math.ceil(list.length / 5) 
    }, [list])
    const pageDatas = useMemo(() => {
        return list.filter((_, index) => {
            return index >= (currentPage - 1) * 5 && index < Math.min(currentPage * 5, list.length)
        })
    }, [currentPage, list])

    const nextEnable = useMemo(() => {
        return list.length > currentPage * 5
    }, [list, currentPage])

    const preEnable = useMemo(() => {
        return currentPage > 1
    }, [currentPage])

    const onNext = useCallback(() => {
        setCurrentPage(currentPage + 1)
    }, [currentPage])

    const onPre = useCallback(() => {
        setCurrentPage(currentPage - 1)
    }, [currentPage])

    useEffect(() => {
        if ((currentPage - 1) * 5 > list.length) {
            setCurrentPage(1)
        }
    }, [list, currentPage])
    return {
        currentPage,
        totalPages,
        pageDatas,
        nextEnable,
        preEnable,
        onNext,
        onPre
    }
}